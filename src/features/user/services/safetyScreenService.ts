import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../shared/firebase/firebaseClient";

export type HomeDoc = {
  lat: number;
  lng: number;
  radiusMeters: number;
  updatedAt?: unknown;
};

/**
 * Reads the current user's home location from Firestore.
 * Uses the same path as admin location settings: users/{uid}/settings/location.
 * Pass the logged-in user's uid so Firestore rules allow the read.
 */
export function useHomeFromFirestore(uid: string | null) {
  const [home, setHome] = useState<HomeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setHome(null);
      setError(null);
      return;
    }

    const ref = doc(db, "users", uid, "settings", "location");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        setLoading(false);
        if (!snap.exists()) {
          setHome(null);
          return;
        }
        const data = snap.data();
        const homeData = data?.home as HomeDoc | undefined;
        setHome(homeData ?? null);
      },
      (e) => {
        setLoading(false);
        setError(e.message);
      }
    );

    return () => unsub();
  }, [uid]);

  return { home, loading, error };
}