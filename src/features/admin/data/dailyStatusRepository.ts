import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient";

export type MealStatus = "ok" | "not ok" | "pending";
export type MedStatus = "ok" | "not ok" | "pending";

export type DailyStatusPayload = {
	date: string; // "2026-01-24" format
	meals: {
		breakfast: MealStatus;
		lunch: MealStatus;
		dinner: MealStatus;
		supper: MealStatus;
	};
	meds: {
		morning: MedStatus;
		noon: MedStatus;
		evening: MedStatus;
		night: MedStatus;
	};
	location: {
		stayedInArea: boolean;
		breaches?: number;
	};
};

export type DailyStatusDoc = DailyStatusPayload & {
	updatedAt?: any;
};

const dailyStatusDocRef = (uid: string, date: string) => 
	doc(db, `users/${uid}/dailyStatus/${date}`);

const dailyStatusCollectionRef = (uid: string) => 
	collection(db, `users/${uid}/dailyStatus`);

export const dailyStatusRepository = {
	async getDailyStatus(uid: string, date: string): Promise<DailyStatusDoc | null> {
		const snap = await getDoc(dailyStatusDocRef(uid, date));
		if (!snap.exists()) return null;
		return snap.data() as DailyStatusDoc;
	},

	async setDailyStatus(uid: string, payload: DailyStatusPayload): Promise<void> {
		try {
			const docRef = dailyStatusDocRef(uid, payload.date);
			await setDoc(
				docRef,
				{ ...payload, updatedAt: serverTimestamp() },
				{ merge: true }
			);
		} catch (error: any) {
			console.error("Error in setDailyStatus:", error);
			throw error;
		}
	},

	async getDailyStatusRange(
		uid: string, 
		startDate: string, 
		endDate: string
	): Promise<DailyStatusDoc[]> {
		// Query with date range and order by date descending
		// Note: Firestore requires a composite index for this query
		// If you get an error, follow the link in the error message to create the index
		const q = query(
			dailyStatusCollectionRef(uid),
			where("date", ">=", startDate),
			where("date", "<=", endDate),
			orderBy("date", "desc")
		);
		
		const snapshot = await getDocs(q);
		return snapshot.docs.map((doc) => doc.data() as DailyStatusDoc);
	},

	async getRecentDailyStatus(uid: string, days: number = 7): Promise<DailyStatusDoc[]> {
		const today = new Date();
		const startDate = new Date(today);
		startDate.setDate(startDate.getDate() - days);
		
		const startDateStr = startDate.toISOString().split("T")[0];
		const endDateStr = today.toISOString().split("T")[0];
		
		return this.getDailyStatusRange(uid, startDateStr, endDateStr);
	},
};
