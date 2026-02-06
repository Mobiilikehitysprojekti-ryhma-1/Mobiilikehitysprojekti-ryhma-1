import { useState, useCallback } from "react";
import { medsRepository, type MedsItems } from "../data/medsRepository";

export function useMeds(uid: string | undefined) {
	const [meds, setMeds] = useState<MedsItems | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadMeds = useCallback(async () => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			const medsDoc = await medsRepository.getMeds(uid);
			if (medsDoc?.items) {
				setMeds(medsDoc.items);
			} else {
				// Set default values if no meds exist
				setMeds({
					morning: { label: "Aamulääke", time: "08:30" },
					noon: { label: "Päivälääke", time: "12:30" },
					evening: { label: "Iltalääke", time: "18:30" },
					night: { label: "Yölääke", time: "22:00" },
				});
			}
		} catch (err: any) {
			console.error("Error loading meds:", err);
			setError(err.message || "Failed to load medications");
		} finally {
			setLoading(false);
		}
	}, [uid]);

	const saveMeds = useCallback(async (medsToSave: MedsItems) => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			await medsRepository.setMeds(uid, medsToSave);
			setMeds(medsToSave);
		} catch (err: any) {
			console.error("Error saving meds:", err);
			setError(err.message || "Failed to save medications");
			throw err;
		} finally {
			setLoading(false);
		}
	}, [uid]);

	const updateMedTime = useCallback((key: keyof MedsItems, time: string) => {
		setMeds((prev) => {
			if (!prev) return null;
			return {
				...prev,
				[key]: { ...prev[key], time },
			};
		});
	}, []);

	return {
		meds,
		loading,
		error,
		loadMeds,
		saveMeds,
		updateMedTime,
	};
}
