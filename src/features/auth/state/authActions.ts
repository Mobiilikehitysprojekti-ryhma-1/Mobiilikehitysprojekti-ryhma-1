import { z } from "zod";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../shared/firebase/firebaseClient";
import { createUserProfile } from "../../../shared/firebase/profileRepository";
import { clearLocalUnlock } from "../data/localUnlock";
import { clearDeviceMode } from "../data/deviceMode";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(1),
});

const resetSchema = z.object({
    email: z.string().email(),
});

//Check credentials with firebase
export async function login(input: unknown) {
    try {
        const { email, password } = loginSchema.parse(input);
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error: any) {
        const code = typeof error?.code === "string" ? error.code : "";
        alert(code ? `Login failed: ${code}` : "Login failed");
        return false;
    }
}

//Register with Firebase
export async function register(input: unknown) {
    try {
        const { email, password, username } = registerSchema.parse(input);

        const res = await createUserWithEmailAndPassword(auth, email, password);

        await createUserProfile(res.user.uid, {
            email,
            username,
        });

        return true;
    } catch (error: any) {
        const code = typeof error?.code === "string" ? error.code : "";
        alert(code ? `Register failed: ${code}` : "Register failed");
        return false;
    }
}

//Logout with Firebase
export async function logout() {
    await signOut(auth);
    await clearLocalUnlock();
    await clearDeviceMode();
}


export async function resetPassword(input: unknown) {
    try {
        const { email } = resetSchema.parse(input);
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch {
        alert("Password reset failed");
        return false;
    }
}