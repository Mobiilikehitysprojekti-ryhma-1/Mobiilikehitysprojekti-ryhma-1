import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getDistance } from "geolib";

import { useHomeFromFirestore } from "../services/safetyScreenService";

/**
 * Store for the Safety screen: home from Firestore + device location watch + derived state.
 * Keeps the screen as pure UI; all state and side effects live here.
 */
export type UserPosition = { latitude: number; longitude: number };

export function useSafetyScreen(uid: string | null) {
  const { home, loading, error } = useHomeFromFirestore(uid);
  const [status, setStatus] = useState<string>("pyytää lupaa…");
  const [distanceM, setDistanceM] = useState<number | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);

  useEffect(() => {
    if (home == null) setDistanceM(null);

    let sub: Location.LocationSubscription | null = null;

    (async () => {
      const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      if (permStatus !== "granted") {
        setStatus("Sijaintilupaa ei myönnetty");
        return;
      }

      // watch the user's position every 10 meters and 3 seconds
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 3000 },
        (loc) => {
          const pos: UserPosition = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserPosition(pos);
          if (home != null) {
            const d = getDistance(pos, { latitude: home.lat, longitude: home.lng });
            setDistanceM(d);
          } else {
            setDistanceM(null);
          }
        }
      );
    })();

    return () => sub?.remove();
  }, [home]);

  const inside = distanceM != null && home != null && distanceM <= home.radiusMeters;

  // Show position when available; otherwise show permission/loading status
  const statusText =
    userPosition != null
      ? "Käyttäjän sijainti on: " + userPosition.latitude + ", " + userPosition.longitude
      : status;

  return {
    home,
    loading,
    error,
    status: statusText,
    distanceM,
    inside,
    userPosition,
  };
}
