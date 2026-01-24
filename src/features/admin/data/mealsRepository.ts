import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient";

export type ScheduleItem = {
	label: string;
	time: string; // "HH:MM"
};

export type MealsItems = {
	breakfast: ScheduleItem;
	lunch: ScheduleItem;
	dinner: ScheduleItem;
	supper: ScheduleItem;
};

export type MealsScheduleDoc = {
	items: MealsItems;
	updatedAt?: any;
};

const mealsDocRef = (uid: string) => doc(db, `users/${uid}/schedules/meals`);

export const mealsRepository = {
	async getMeals(uid: string): Promise<MealsScheduleDoc | null> {
		const snap = await getDoc(mealsDocRef(uid));
		if (!snap.exists()) return null;
		return snap.data() as MealsScheduleDoc;
	},

	async setMeals(uid: string, items: MealsItems): Promise<void> {
		await setDoc(
			mealsDocRef(uid),
			{ items, updatedAt: serverTimestamp() },
			{ merge: true }
		);
	},

	async updateMealField(
		uid: string,
		key: keyof MealsItems,
		patch: Partial<ScheduleItem>
	): Promise<void> {
		const updates: Record<string, any> = { updatedAt: serverTimestamp() };
		if (patch.time !== undefined) updates[`items.${key}.time`] = patch.time;
		if (patch.label !== undefined) updates[`items.${key}.label`] = patch.label;

		await updateDoc(mealsDocRef(uid), updates);
	},
};
