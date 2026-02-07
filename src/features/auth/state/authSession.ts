import { useSyncExternalStore } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../shared/firebase/firebaseClient";
import { ensureUnlockedOnLaunch, clearLocalUnlock } from "../data/localUnlock";
import { fetchUserProfile, createUserProfile } from "../../../shared/firebase/profileRepository";
import { getDeviceMode, setDeviceMode as persistDeviceMode } from "../data/deviceMode";
import type { DeviceMode } from "../data/deviceMode";

//Authentication logic is handled here with Firebase and React
type AuthState = {
  user: { uid: string } | null;
  unlocked: boolean;
  deviceMode: DeviceMode | null;
};

//Global auth state
let state: AuthState = {
  user: null,
  unlocked: false,
  deviceMode: null,
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

  const unsub = onAuthStateChanged(auth, async (fbUser) => {
    try {
      if (!fbUser) {
        await clearLocalUnlock();
        setState({ user: null, unlocked: false, deviceMode: null });
      } else {
        const unlocked = await ensureUnlockedOnLaunch();
        const deviceMode = await getDeviceMode();
        const profile = await fetchUserProfile(fbUser.uid);

        if (!profile) {
          await createUserProfile(fbUser.uid, {
            email: fbUser.email ?? "",
            username: "",
          });
        }

        setState({ user: { uid: fbUser.uid }, unlocked, deviceMode });
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

export async function chooseDeviceMode(mode: DeviceMode): Promise<void> {
  await persistDeviceMode(mode);
  setState({ deviceMode: mode });
}