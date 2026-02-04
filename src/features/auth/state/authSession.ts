import { useSyncExternalStore } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../shared/firebase/firebaseClient";
import { ensureUnlockedOnLaunch, clearLocalUnlock } from "../data/localUnlock";
import { fetchUserProfile, createUserProfile } from "../../../shared/firebase/profileRepository";


type Role = "admin" | "user";

//Authentication logic is handled here with Firebase and React
type AuthState = {
  user: { uid: string, role: Role } | null;
  unlocked: boolean;
};

//Global auth state
let state: AuthState = {
  user: null,
  unlocked: false
};
const listeners = new Set<() => void>();

function setState(partial: Partial<AuthState>) {
  state = { ...state, ...partial };
  listeners.forEach((l) => l());
}

//Hook that is used for reading the auth state
export function useAuthSession() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state
  );
}


//Initializes Firebase listener
export function initAuthListener(onReady: () => void) {
  let readyCalled = false;

  const unsub = onAuthStateChanged(auth, async (fbUser) => { //fb = firebase user
    try {
      if (!fbUser) {
        await clearLocalUnlock();
        setState({ user: null, unlocked: false });
      } else {
        const unlocked = await ensureUnlockedOnLaunch();
        const profile = await fetchUserProfile(fbUser.uid);

        //Handle roles
        if (!profile) {
          await createUserProfile(fbUser.uid, {
            email: fbUser.email ?? "",
            username: "",
            role: "user",
          });
          setState({ user: { uid: fbUser.uid, role: "user" }, unlocked });
        } else {
          const role: Role = profile.role === "admin" ? "admin" : "user";
          setState({ user: { uid: fbUser.uid, role }, unlocked });
        }
      }
    } finally {
      if (!readyCalled) {
        readyCalled = true;
        onReady();
      }
    }
  });

  return unsub;
}

export async function requestUnlock(): Promise<boolean> {
  const unlocked = await ensureUnlockedOnLaunch();
  setState({ unlocked });
  return unlocked;
}

export function lockApp() {
  setState({ unlocked: false });
}
