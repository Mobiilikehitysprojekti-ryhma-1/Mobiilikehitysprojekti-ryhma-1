import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient";
import type { DailyStatusDoc } from "../data/dailyStatusRepository";

export type BPDoc = {
  date: string; // "YYYY-MM-DD"
  bloodPressure?: {
    morning?: {
      reading: { sys: number | null; dia: number | null; pulse: number | null };
      status: string;
    };
    evening?: {
      reading: { sys: number | null; dia: number | null; pulse: number | null };
      status: string;
    };
  };
};

export async function fetchLast14BPDocs(userId: string): Promise<BPDoc[]> {
  const colRef = collection(db, "users", userId, "dailyStatus");

  // Get the last 60 days
  const q = query(colRef, orderBy("date", "desc"), limit(60));
  const snap = await getDocs(q);

  const withBP: BPDoc[] = snap.docs
    .map((d) => d.data() as DailyStatusDoc)
    .filter((doc) => !!doc.bloodPressure)
    .map((doc) => ({
      date: doc.date,
      bloodPressure: doc.bloodPressure,
    }));

  // Take the last 14 most recent days and return them in reverse order
  const last14 = withBP.slice(0, 14).reverse();
  return last14;
}
