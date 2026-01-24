import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient"; // <-- korjaa polku teidän mukaan

export type LocationPayload = {
  enabled: boolean;
  home?: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
};

export type LocationDoc = LocationPayload & {
  updatedAt?: any;
};

const locationDocRef = (uid: string) => doc(db, `users/${uid}/settings/location`);

export const locationRepository = {
  async getLocation(uid: string): Promise<LocationDoc | null> {
    const snap = await getDoc(locationDocRef(uid));
    if (!snap.exists()) return null;
    return snap.data() as LocationDoc;
  },

  async setLocation(uid: string, payload: LocationPayload): Promise<void> {
    await setDoc(
      locationDocRef(uid),
      { ...payload, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  // (valinnainen) yhden kentän päivitys
  async updateLocation(uid: string, patch: Partial<LocationPayload>): Promise<void> {
    await updateDoc(locationDocRef(uid), { ...patch, updatedAt: serverTimestamp() });
  },
};
