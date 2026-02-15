import { useState, useCallback, useEffect } from "react";
import { mealsRepository, type MealsItems } from "../../admin/data/mealsRepository";
import { medsRepository, type MedsItems } from "../../admin/data/medsRepository";
import {
	dailyStatusRepository,
	type DailyStatusDoc,
	type DailyStatusPayload,
} from "../../admin/data/dailyStatusRepository";

const defaultMeals: MealsItems = {
	breakfast: { label: "Aamiainen", time: "08:00" },
	lunch: { label: "Lounas", time: "12:00" },
	dinner: { label: "Päivällinen", time: "17:00" },
	supper: { label: "Illallinen", time: "20:00" },
};

const defaultMeds: MedsItems = {
	morning: { label: "Aamu", time: "08:30" },
	noon: { label: "Päivä", time: "12:30" },
	evening: { label: "Ilta", time: "18:30" },
	night: { label: "Yö", time: "22:00" },
};

const pendingMeals: DailyStatusDoc["meals"] = {
	breakfast: "pending",
	lunch: "pending",
	dinner: "pending",
	supper: "pending",
};

const pendingMeds: DailyStatusDoc["meds"] = {
	morning: "pending",
	noon: "pending",
	evening: "pending",
	night: "pending",
};

function todayStr(): string {
	return new Date().toISOString().split("T")[0];
}

export function useHomeSchedule(uid: string | undefined) {
	const [mealsSchedule, setMealsSchedule] = useState<MealsItems | null>(null);
	const [medsSchedule, setMedsSchedule] = useState<MedsItems | null>(null);
	const [todayStatus, setTodayStatus] = useState<DailyStatusDoc | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		if (!uid) return;

		setLoading(true);
		setError(null);
		try {
			const date = todayStr();

			const [mealsDoc, medsDoc, statusDoc] = await Promise.all([
				mealsRepository.getMeals(uid),
				medsRepository.getMeds(uid),
				dailyStatusRepository.getDailyStatus(uid, date),
			]);

			setMealsSchedule(mealsDoc?.items ?? defaultMeals);
			setMedsSchedule(medsDoc?.items ?? defaultMeds);

			if (statusDoc) {
				setTodayStatus(statusDoc);
			} else {
				const initialPayload: DailyStatusPayload = {
					date,
					meals: pendingMeals,
					meds: pendingMeds,
					location: { stayedInArea: true, breaches: 0 },
				};
				await dailyStatusRepository.setDailyStatus(uid, initialPayload);
				setTodayStatus({ ...initialPayload, updatedAt: undefined });
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Failed to load schedule";
			console.error("Error loading home schedule:", err);
			setError(message);
		} finally {
			setLoading(false);
		}
	}, [uid]);

	useEffect(() => {
		load();
	}, [load]);

	const markMealTaken = useCallback(
		async (key: keyof MealsItems) => {
			if (!uid || !todayStatus) return;
			const date = todayStr();
			const payload: DailyStatusPayload = {
				date,
				meals: { ...todayStatus.meals, [key]: "ok" as const },
				meds: todayStatus.meds,
				location: todayStatus.location,
				bloodPressure: todayStatus.bloodPressure,
			};
			await dailyStatusRepository.setDailyStatus(uid, payload);
			setTodayStatus((prev) => (prev ? { ...prev, meals: payload.meals } : null));
		},
		[uid, todayStatus]
	);

	const markMedTaken = useCallback(
		async (key: keyof MedsItems) => {
			if (!uid || !todayStatus) return;
			const date = todayStr();
			const payload: DailyStatusPayload = {
				date,
				meals: todayStatus.meals,
				meds: { ...todayStatus.meds, [key]: "ok" as const },
				location: todayStatus.location,
				bloodPressure: todayStatus.bloodPressure,
			};
			await dailyStatusRepository.setDailyStatus(uid, payload);
			setTodayStatus((prev) => (prev ? { ...prev, meds: payload.meds } : null));
		},
		[uid, todayStatus]
	);

	return {
		mealsSchedule,
		medsSchedule,
		todayStatus,
		loading,
		error,
		refetch: load,
		markMealTaken,
		markMedTaken,
	};
}
