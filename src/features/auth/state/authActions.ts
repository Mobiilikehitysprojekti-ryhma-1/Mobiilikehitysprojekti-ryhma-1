import { z } from "zod";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../shared/firebase/firebaseClient";
import { createUserProfile } from "../../../shared/firebase/profileRepository";
import { clearLocalUnlock } from "../data/localUnlock";

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function login(input: unknown) {
    const { email, password } = credentialsSchema.parse(input);
    await signInWithEmailAndPassword(auth, email, password);
}

export async function register(input: unknown) {
    const { email, password } = credentialsSchema.parse(input);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(res.user.uid, { email });
}

export async function logout() {
    await signOut(auth);
    await clearLocalUnlock();
}
