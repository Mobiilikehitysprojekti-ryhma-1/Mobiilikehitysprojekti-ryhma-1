import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseClient";

export type UserProfile = {
    email: string;
    username: string;
    createdAt: number;
};

export async function createUserProfile(uid: string, data: { email: string; username: string }) {
    const payload: UserProfile = {
        email: data.email,
        username: data.username,
        createdAt: Date.now(),
    };

    await setDoc(doc(db, "users", uid), payload, { merge: true });
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
}
