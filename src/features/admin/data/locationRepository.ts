import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient";
import Geocoding from "react-native-geocoding";
import Constants from "expo-constants";

export type LocationPayload = {
  enabled: boolean;
  home?: {
    lat: number;
    lng: number;
    radiusMeters: number;
    address?: string; // Store the formatted address
  };
};

export type LocationDoc = LocationPayload & {
  updatedAt?: any;
};

export type GeocodeResult = {
  success: boolean;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
  addressComponents?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  error?: string;
  code?: "INVALID_ADDRESS" | "API_ERROR" | "RATE_LIMIT" | "UNKNOWN";
};

const locationDocRef = (uid: string) => doc(db, `users/${uid}/settings/location`);

export const locationRepository = {
  async getLocation(uid: string): Promise<LocationDoc | null> {
    const snap = await getDoc(locationDocRef(uid));
    if (!snap.exists()) return null;
    return snap.data() as LocationDoc;
  },

  async setLocation(uid: string, payload: LocationPayload): Promise<void> {
    await setDoc(
      locationDocRef(uid),
      { ...payload, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  // (valinnainen) yhden kentän päivitys
  async updateLocation(uid: string, patch: Partial<LocationPayload>): Promise<void> {
    await updateDoc(locationDocRef(uid), { ...patch, updatedAt: serverTimestamp() });
  },

  /**
   * Geocode an address string to latitude/longitude coordinates
   * Uses react-native-geocoding (client-side Google Geocoding API)
   */
  async geocodeAddress(address: string): Promise<GeocodeResult> {
    try {
      // Initialize Geocoding with API key from environment variables
      // Get API key from expo config or environment variable
      const apiKey = 
        Constants.expoConfig?.extra?.geocodingApiKey || 
        process.env.EXPO_PUBLIC_GEOCODING_API_KEY;

      if (!apiKey) {
        console.error("Geocoding API key not configured");
        return {
          success: false,
          error: "Geocoding service is not configured. Please contact support.",
          code: "API_ERROR",
        };
      }

      // Initialize Geocoding (only needs to be done once, but safe to call multiple times)
      Geocoding.init(apiKey);

      // Validate input
      if (!address || typeof address !== "string" || address.trim().length === 0) {
        return {
          success: false,
          error: "Address is required and must be a non-empty string.",
          code: "INVALID_ADDRESS",
        };
      }

      // Limit address length to prevent abuse
      if (address.length > 500) {
        return {
          success: false,
          error: "Address is too long. Maximum 500 characters.",
          code: "INVALID_ADDRESS",
        };
      }

      // Call geocoding API
      const response = await Geocoding.from(address.trim());

      // Check if we got results
      if (!response.results || response.results.length === 0) {
        return {
          success: false,
          error: "Address not found. Please check and try again.",
          code: "INVALID_ADDRESS",
        };
      }

      // Extract the first (most relevant) result
      const result = response.results[0];
      const location = result.geometry.location;

      // Parse address components
      const addressComponents: GeocodeResult["addressComponents"] = {};
      result.address_components?.forEach((component: any) => {
        if (component.types.includes("street_number") || component.types.includes("route")) {
          addressComponents.street = component.long_name;
        }
        if (component.types.includes("locality") || component.types.includes("administrative_area_level_1")) {
          addressComponents.city = component.long_name;
        }
        if (component.types.includes("country")) {
          addressComponents.country = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          addressComponents.postalCode = component.long_name;
        }
      });

      return {
        success: true,
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
        addressComponents,
      };
    } catch (error: any) {
      console.error("Geocoding error:", error);

      // Handle specific error types
      if (error.message?.includes("ZERO_RESULTS")) {
        return {
          success: false,
          error: "Address not found. Please check and try again.",
          code: "INVALID_ADDRESS",
        };
      }

      if (error.message?.includes("OVER_QUERY_LIMIT")) {
        return {
          success: false,
          error: "Geocoding service is temporarily unavailable. Please try again later.",
          code: "RATE_LIMIT",
        };
      }

      if (error.message?.includes("REQUEST_DENIED") || error.message?.includes("API key")) {
        return {
          success: false,
          error: "Geocoding service is not configured. Please contact support.",
          code: "API_ERROR",
        };
      }

      return {
        success: false,
        error: error.message || "Failed to geocode address",
        code: "UNKNOWN",
      };
    }
  },
};
