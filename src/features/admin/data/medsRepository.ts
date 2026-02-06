import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient";

export type ScheduleItem = {
	label: string;
	time: string; // "HH:MM"
};

export type MedsItems = {
	morning: ScheduleItem;
	noon: ScheduleItem;
	evening: ScheduleItem;
	night: ScheduleItem;
};

export type MedsScheduleDoc = {
	items: MedsItems;
	updatedAt?: any;
};

const medsDocRef = (uid: string) => doc(db, `users/${uid}/schedules/meds`);

export const medsRepository = {
	async getMeds(uid: string): Promise<MedsScheduleDoc | null> {
		const snap = await getDoc(medsDocRef(uid));
		if (!snap.exists()) return null;
		return snap.data() as MedsScheduleDoc;
	},

	async setMeds(uid: string, items: MedsItems): Promise<void> {
		await setDoc(
			medsDocRef(uid),
			{ items, updatedAt: serverTimestamp() },
			{ merge: true }
		);
	},

	async updateMedField(
		uid: string,
		key: keyof MedsItems,
		patch: Partial<ScheduleItem>
	): Promise<void> {
		const updates: Record<string, any> = { updatedAt: serverTimestamp() };
		if (patch.time !== undefined) updates[`items.${key}.time`] = patch.time;
		if (patch.label !== undefined) updates[`items.${key}.label`] = patch.label;

		await updateDoc(medsDocRef(uid), updates);
	},
};
