import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseClient";

export async function createUserProfile(uid: string, data: { email: string }) {
    await setDoc(doc(db, "users", uid), {
        email: data.email,
        createdAt: Date.now(),
    });
}

export async function fetchUserProfile(uid: string) {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
}
