/* eslint-disable require-jsdoc */


"use strict";

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");
const OpenAI = require("openai");

// Initialize client lazily to avoid errors during deployment analysis
let client = null;
/**
 * Gets or creates the OpenAI client instance.
 * @return {OpenAI} The OpenAI client instance.
 */
function getClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    client = new OpenAI({apiKey});
  }
  return client;
}

/**
 * Extracts JSON from text that might be wrapped in markdown code blocks
 * or have extra text.
 * @param {string} text The text to extract JSON from
 * @return {Object} The parsed JSON object
 */
function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is empty or not a string");
  }

  // Try to parse as-is first
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    // Continue to extraction methods
  }

  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  let cleaned = text.trim();

  // Remove markdown code blocks
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "");
  cleaned = cleaned.replace(/\n?```\s*$/i, "");

  // Try to find JSON object in the text
  // Look for { ... } pattern
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      // Try to fix common issues before parsing
      let jsonStr = jsonMatch[0];

      // Remove trailing commas before closing braces/brackets
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

      return JSON.parse(jsonStr);
    } catch (e) {
      logger.warn("Failed to parse extracted JSON", {
        extracted: jsonMatch[0],
        error: e.message,
      });
    }
  }

  // If still no luck, try to extract just the JSON part more aggressively
  // Remove everything before first { and after last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      let jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
      // Remove trailing commas
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");
      return JSON.parse(jsonStr);
    } catch (e) {
      logger.warn("Failed to parse JSON from braces", {
        extracted: cleaned.substring(firstBrace, lastBrace + 1),
        error: e.message,
      });
    }
  }

  // Last resort: throw error with the original text
  throw new Error(
      `Could not extract valid JSON from: ${text.substring(0, 500)}`,
  );
}

/**
 * Callable Cloud Function: lukee verenpainemittarin kuvasta sys/dia/pulse.
 * @param {import("firebase-functions/v2/https").CallableRequest} request
 * @returns {Promise<Object>}
 */


exports.parseBloodPressure = onCall(async (request) => {
  try {
    logger.info("parseBloodPressure called", {
      userId: request.auth?.uid,
      hasData: !!request.data,
      base64Length: request.data?.base64?.length,
    });

    if (!request.auth) {
      logger.warn("Unauthenticated request");
      throw new HttpsError("unauthenticated", "Kirjaudu sisään.");
    }

    const data = request.data || {};
    const base64 = data.base64;

    if (!base64 || typeof base64 !== "string") {
      logger.error("Missing base64 data", {
        hasBase64: !!base64,
        type: typeof base64,
      });
      throw new HttpsError("invalid-argument", "base64 puuttuu");
    }

    logger.info("Base64 received", {
      length: base64.length,
      prefix: base64.substring(0, 20),
    });

    let imageUrl = base64;
    if (base64.indexOf("data:image") !== 0) {
      imageUrl = "data:image/jpeg;base64," + base64;
    }

    const promptParts = [
      "Lue verenpainemittarin näytöltä arvot ja palauta JSON-objekti: ",
      "{\"sys\": number|null, \"dia\": number|null, ",
      "\"pulse\": number|null}. ",
      "Jos et ole varma, käytä null. ",
      "Esimerkki: {\"sys\": 120, \"dia\": 80, \"pulse\": 70}",
    ];
    const prompt = promptParts.join("");

    logger.info("Calling OpenAI API", {
      model: "gpt-4o-mini",
      imageUrlLength: imageUrl.length,
    });

    let resp;
    try {
      // Try with JSON mode first (may not be supported by all vision models)
      const requestConfig = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {type: "text", text: prompt},
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      };

      // Try with JSON mode, but fall back if not supported
      try {
        resp = await getClient().chat.completions.create({
          ...requestConfig,
          response_format: {type: "json_object"},
        });
        logger.info("OpenAI API response received (with JSON mode)");
      } catch (jsonModeError) {
        // If JSON mode fails, try without it
        // (some vision models don't support it)
        logger.warn("JSON mode not supported, falling back", {
          error: jsonModeError.message,
        });
        resp = await getClient().chat.completions.create(requestConfig);
        logger.info("OpenAI API response received (without JSON mode)");
      }

      logger.info("OpenAI API response received", {
        hasChoices: !!resp?.choices,
        choicesLength: resp?.choices?.length,
      });
    } catch (openaiError) {
      logger.error("OpenAI API error", {
        error: openaiError.message,
        stack: openaiError.stack,
        code: openaiError.code,
        status: openaiError.status,
      });
      throw new HttpsError(
          "internal",
          `OpenAI API virhe: ${openaiError.message || "Tuntematon virhe"}`,
      );
    }

    let outText = "";
    if (resp && resp.choices && resp.choices.length > 0) {
      const choice = resp.choices[0];
      if (choice && choice.message && choice.message.content) {
        outText = choice.message.content;
      }
    }

    logger.info("Extracted text from response", {
      hasText: !!outText,
      textLength: outText.length,
      textPreview: outText.substring(0, 100),
    });

    if (!outText) {
      logger.error("No text in OpenAI response", {
        response: JSON.stringify(resp),
      });
      throw new HttpsError("internal", "AI ei palauttanut tekstiä.");
    }

    let parsed;
    try {
      // Use the robust JSON extraction function
      parsed = extractJSON(outText);
      logger.info("JSON parsed successfully", {parsed});
    } catch (parseError) {
      logger.error("JSON parse error", {
        error: parseError.message,
        text: outText,
        textLength: outText.length,
      });
      throw new HttpsError(
          "internal",
          `AI ei palauttanut kelvollista JSONia: ${parseError.message}. ` +
          `Vastaus (${outText.length} merkkiä): ` +
          `${outText.substring(0, 300)}`,
      );
    }

    const sys = parsed && parsed.sys != null ? parsed.sys : null;
    const dia = parsed && parsed.dia != null ? parsed.dia : null;
    const pulse = parsed && parsed.pulse != null ? parsed.pulse : null;

    logger.info("Parsed values", {
      sys,
      dia,
      pulse,
    });

    const ok =
      (sys === null || (sys >= 70 && sys <= 250)) &&
      (dia === null || (dia >= 40 && dia <= 150)) &&
      (pulse === null || (pulse >= 30 && pulse <= 220));

    if (!ok) {
      logger.warn("Values out of range", {sys, dia, pulse});
      throw new HttpsError(
          "internal",
          "Tulokset eivät vaikuta järkeviltä. Ota kuva uudestaan.",
      );
    }

    const result = {
      sys,
      dia,
      pulse,
    };

    logger.info("Successfully returning result", result);
    return result;
  } catch (error) {
    if (error instanceof HttpsError) {
      logger.error("HttpsError thrown", {
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    logger.error("Unexpected error in parseBloodPressure", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });

    throw new HttpsError(
        "internal",
        `Odottamaton virhe: ${error.message || "Tuntematon virhe"}`,
    );
  }
});
