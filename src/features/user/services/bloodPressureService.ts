import * as ImagePicker from "expo-image-picker";
import { getFunctions, httpsCallable } from "firebase/functions";

export type BloodPressureResult = {
  sys: number | null;
  dia: number | null;
  pulse: number | null;
};

export async function takePhotoAndReadBP(): Promise<BloodPressureResult | null> {
  try {
    console.log("[takePhotoAndReadBP] Requesting camera permissions...");
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    console.log("[takePhotoAndReadBP] Permission status:", perm.status);
    if (perm.status !== "granted") {
      throw new Error("Kameran lupaa ei myönnetty");
    }

    console.log("[takePhotoAndReadBP] Launching camera...");
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      base64: true,
    });

    if (res.canceled) {
      console.log("[takePhotoAndReadBP] User canceled photo");
      return null;
    }

    const base64 = res.assets?.[0]?.base64;
    if (!base64) {
      console.error("[takePhotoAndReadBP] No base64 data in image");
      throw new Error("Kuvan base64 puuttuu");
    }

    console.log("[takePhotoAndReadBP] Photo taken, base64 length:", String(base64.length));
    console.log("[takePhotoAndReadBP] Calling Firebase function...");

    const functions = getFunctions();
    const parseBloodPressure = httpsCallable<
      { base64: string },
      BloodPressureResult
    >(functions, "parseBloodPressure");

    try {
      const result = await parseBloodPressure({ base64 });
      console.log("[takePhotoAndReadBP] Function call successful");
      console.log("[takePhotoAndReadBP] Result:", JSON.stringify(result.data, null, 2));
      return result.data;
    } catch (firebaseError: any) {
      console.error("[takePhotoAndReadBP] Firebase function error:", firebaseError?.message || String(firebaseError));
      console.error("[takePhotoAndReadBP] Error details:", JSON.stringify({
        code: firebaseError?.code,
        message: firebaseError?.message,
        details: firebaseError?.details,
      }, null, 2));

      // Provide more detailed error message
      if (firebaseError.code === "functions/internal") {
        throw new Error(
          `Firebase sisäinen virhe: ${firebaseError.message || "Tuntematon virhe"}. ` +
          `Tarkista Firebase Functions -lokit lisätietoja varten.`,
        );
      }

      throw new Error(
        `Firebase virhe (${firebaseError.code}): ${firebaseError.message || "Tuntematon virhe"}`,
      );
    }
  } catch (error: any) {
    console.error("[takePhotoAndReadBP] Unexpected error:", error?.message || String(error));
    console.error("[takePhotoAndReadBP] Error details:", JSON.stringify({
      message: error?.message,
      name: error?.name,
    }, null, 2));
    throw error;
  }
}
