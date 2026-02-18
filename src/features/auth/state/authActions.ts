import { z } from "zod";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../../shared/firebase/firebaseClient";
import { createUserProfile } from "../../../shared/firebase/profileRepository";
import { clearLocalUnlock } from "../data/localUnlock";

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
});

const resetPasswordSchema = z.object({
    email: z.string().email(),
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

export async function changePassword(input: unknown) {
    const { currentPassword, newPassword } = changePasswordSchema.parse(input);
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Not authenticated.");
    }

    const email = user.email;
    if (!email) {
        throw new Error("Missing user email; cannot re-authenticate.");
    }

    await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(email, currentPassword)
    );
    await updatePassword(user, newPassword);
}

export async function resetPassword(input: unknown) {
    const { email } = resetPasswordSchema.parse(input);
    await sendPasswordResetEmail(auth, email);
}