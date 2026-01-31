import { useState, useCallback, useEffect } from "react";
import { dailyStatusRepository, type DailyStatusPayload, type DailyStatusDoc } from "../data/dailyStatusRepository";

export function useDailyStatus(uid: string | undefined, days: number = 7) {
	const [statuses, setStatuses] = useState<DailyStatusDoc[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadDailyStatus = useCallback(async () => {
		if (!uid) return;
		
		setLoading(true);
		setError(null);
		try {
			// Lazy initialization: Check if today's status exists, create if not
			const today = new Date().toISOString().split("T")[0];
			const todayStatus = await dailyStatusRepository.getDailyStatus(uid, today);
			
			if (!todayStatus) {
				// Today's status doesn't exist, create it with all items as "pending"
				console.log("Today's status not found, initializing with pending values");
				await dailyStatusRepository.setDailyStatus(uid, {
					date: today,
					meals: {
						breakfast: "pending",
						lunch: "pending",
						dinner: "pending",
						supper: "pending",
					},
					meds: {
						morning: "pending",
						noon: "pending",
						evening: "pending",
						night: "pending",
					},
					location: {
						stayedInArea: true,
						breaches: 0,
					},
				});
				console.log("Today's status initialized successfully");
			}
			
			// Load recent statuses (including the newly created today's status)
			const recentStatuses = await dailyStatusRepository.getRecentDailyStatus(uid, days);
			setStatuses(recentStatuses);
		} catch (err: any) {
			console.error("Error loading daily status:", err);
			setError(err.message || "Failed to load daily status");
		} finally {
			setLoading(false);
		}
	}, [uid, days]);

	const saveDailyStatus = useCallback(async (payload: DailyStatusPayload) => {
		if (!uid) {
			console.error("saveDailyStatus: No uid provided");
			return;
		}
		
		setLoading(true);
		setError(null);
		try {
			await dailyStatusRepository.setDailyStatus(uid, payload);
			// Reload to get updated data
			await loadDailyStatus();
		} catch (err: any) {
			console.error("Error saving daily status:", err);
			setError(err.message || "Failed to save daily status");
			throw err;
		} finally {
			setLoading(false);
		}
	}, [uid, loadDailyStatus]);

	useEffect(() => {
		loadDailyStatus();
	}, [loadDailyStatus]);

	return {
		statuses,
		loading,
		error,
		loadDailyStatus,
		saveDailyStatus,
	};
}
