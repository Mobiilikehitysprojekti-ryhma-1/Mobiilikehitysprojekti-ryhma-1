import { useState, useCallback } from "react";
import { mealsRepository, type MealsItems } from "../data/mealsRepository";

export function useMeals(uid: string | undefined) {
	const [meals, setMeals] = useState<MealsItems | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadMeals = useCallback(async () => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			const mealsDoc = await mealsRepository.getMeals(uid);
			if (mealsDoc?.items) {
				setMeals(mealsDoc.items);
			} else {
				// Set default values if no meals exist
				setMeals({
					breakfast: { label: "Aamupala", time: "08:00" },
					lunch: { label: "Lounas", time: "12:00" },
					dinner: { label: "Päivällinen", time: "17:00" },
					supper: { label: "Iltapala", time: "20:00" },
				});
			}
		} catch (err: any) {
			console.error("Error loading meals:", err);
			setError(err.message || "Failed to load meals");
		} finally {
			setLoading(false);
		}
	}, [uid]);

	const saveMeals = useCallback(async (mealsToSave: MealsItems) => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			await mealsRepository.setMeals(uid, mealsToSave);
			setMeals(mealsToSave);
		} catch (err: any) {
			console.error("Error saving meals:", err);
			setError(err.message || "Failed to save meals");
			throw err;
		} finally {
			setLoading(false);
		}
	}, [uid]);

	const updateMealTime = useCallback((key: keyof MealsItems, time: string) => {
		setMeals((prev) => {
			if (!prev) return null;
			return {
				...prev,
				[key]: { ...prev[key], time },
			};
		});
	}, []);

	return {
		meals,
		loading,
		error,
		loadMeals,
		saveMeals,
		updateMealTime,
	};
}
