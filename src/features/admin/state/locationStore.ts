import { useState, useCallback } from "react";
import { locationRepository, type LocationPayload } from "../data/locationRepository";

export function useLocation(uid: string | undefined) {
	const [location, setLocation] = useState<LocationPayload | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadLocation = useCallback(async () => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			const locationDoc = await locationRepository.getLocation(uid);
			if (locationDoc) {
				setLocation({
					enabled: locationDoc.enabled,
					home: locationDoc.home ? {
						...locationDoc.home,
						address: locationDoc.home.address,
					} : undefined,
				});
			} else {
				// Set default values if no location exists
				setLocation({
					enabled: false,
				});
			}
		} catch (err: any) {
			console.error("Error loading location:", err);
			setError(err.message || "Failed to load location");
		} finally {
			setLoading(false);
		}
	}, [uid]);

	const saveLocation = useCallback(async (locationToSave: LocationPayload) => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			await locationRepository.setLocation(uid, locationToSave);
			setLocation(locationToSave);
		} catch (err: any) {
			console.error("Error saving location:", err);
			setError(err.message || "Failed to save location");
			throw err;
		} finally {
			setLoading(false);
		}
	}, [uid]);

	const updateLocation = useCallback(async (patch: Partial<LocationPayload>) => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			await locationRepository.updateLocation(uid, patch);
			setLocation((prev) => {
				if (!prev) return null;
				return { ...prev, ...patch };
			});
		} catch (err: any) {
			console.error("Error updating location:", err);
			setError(err.message || "Failed to update location");
			throw err;
		} finally {
			setLoading(false);
		}
	}, [uid]);

	/**
	 * Geocode an address and save it as the home location
	 * @param address - The address string to geocode
	 * @param radiusMeters - The radius in meters for the safety area
	 * @returns The geocoded result with coordinates and formatted address
	 */
	const geocodeAndSave = useCallback(async (address: string, radiusMeters: number) => {
		if (!uid) {
			throw new Error("User ID is required");
		}

		setLoading(true);
		setError(null);
		
		try {
			// Geocode the address
			const geocodeResult = await locationRepository.geocodeAddress(address);
			
			if (!geocodeResult.success || !geocodeResult.lat || !geocodeResult.lng) {
				const errorMessage = geocodeResult.error || "Failed to geocode address";
				setError(errorMessage);
				throw new Error(errorMessage);
			}

			// Save the location with geocoded coordinates and address
			const locationToSave: LocationPayload = {
				enabled: true,
				home: {
					lat: geocodeResult.lat,
					lng: geocodeResult.lng,
					radiusMeters,
					address: geocodeResult.formattedAddress,
				},
			};

			await locationRepository.setLocation(uid, locationToSave);
			setLocation(locationToSave);

			// Return the geocode result for display purposes
			return geocodeResult;
		} catch (err: any) {
			console.error("Error geocoding and saving location:", err);
			setError(err.message || "Failed to geocode and save location");
			throw err;
		} finally {
			setLoading(false);
		}
	}, [uid]);

	return {
		location,
		loading,
		error,
		loadLocation,
		saveLocation,
		updateLocation,
		geocodeAndSave,
	};
}
