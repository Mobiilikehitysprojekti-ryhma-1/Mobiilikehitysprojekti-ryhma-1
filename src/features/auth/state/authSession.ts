import { useSyncExternalStore } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../shared/firebase/firebaseClient";
import { ensureUnlockedOnLaunch, clearLocalUnlock } from "../data/localUnlock";
import { fetchUserProfile } from "../../../shared/firebase/profileRepository";

type AuthState = {
    user: { uid: string } | null;
    unlocked: boolean;
};

let state: AuthState = { user: null, unlocked: false };
const listeners = new Set<() => void>();

function setState(partial: Partial<AuthState>) {
    state = { ...state, ...partial };
    listeners.forEach((l) => l());
}

export function useAuthSession() {
    return useSyncExternalStore(
        (cb) => {
            listeners.add(cb);
            return () => listeners.delete(cb);
        },
        () => state
    );
}

export function initAuthListener(onReady: () => void) {
    let readyCalled = false;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
            await clearLocalUnlock();
            setState({ user: null, unlocked: false });
        } else {
            // 1) Device-level unlock (PIN/biometrics)
            const unlocked = await ensureUnlockedOnLaunch();
            // 2) Fetch profile (Firestore)
            await fetchUserProfile(fbUser.uid);
            setState({ user: { uid: fbUser.uid }, unlocked });
        }

        if (!readyCalled) {
            readyCalled = true;
            onReady();
        }
    });

    return unsub;
}
