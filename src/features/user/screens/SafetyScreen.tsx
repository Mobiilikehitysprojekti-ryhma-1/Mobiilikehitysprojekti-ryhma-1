import React, { useEffect, useRef, useState } from "react";
import { Alert, Switch, View } from "react-native";
import { Appbar, Text } from "react-native-paper";

import { useAuth } from "../../../shared/hooks/useAuth";
import { useSafetyScreen } from "../state/safetyScreenStore";
import MapView, { Marker, Circle } from "react-native-maps";

// default delta is 0.004 degrees, which is approximately 400 meters at the equator

const DEFAULT_DELTA = 0.004;

// fallback center is Helsinki, Finland

const FALLBACK_CENTER = { latitude: 60.1699, longitude: 24.9384 };

export default function SafetyScreen() {
  const { user } = useAuth();
  const { home, loading, error, status, distanceM, inside, userPosition } =
    useSafetyScreen(user?.uid ?? null);
  const mapRef = useRef<MapView>(null);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
// initial region is the user's position or the home position, or the fallback center to center the map

  const initialRegion = {
    latitude: userPosition?.latitude ?? home?.lat ?? FALLBACK_CENTER.latitude,
    longitude: userPosition?.longitude ?? home?.lng ?? FALLBACK_CENTER.longitude,
    latitudeDelta: DEFAULT_DELTA,
    longitudeDelta: DEFAULT_DELTA,
  };

  // animate to the user's position or the home position, or the fallback center to center the map

  useEffect(() => {
    if (!userPosition || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: userPosition.latitude,
        longitude: userPosition.longitude,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
      },
      500
    );
  }, [userPosition?.latitude, userPosition?.longitude]);

  // Show alert when tracking is on and user is outside safe zone
  useEffect(() => {
    if (isTrackingEnabled && inside === false) {
      Alert.alert("Lähetä omaiselle ilmoitus sähköpostilla tai notifikaatiolla", "Käyttäjä on ulkona turvallisuus alueelta.");
    }
  }, [isTrackingEnabled, inside]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Turvallisuus" />
      </Appbar.Header>

      <View style={{paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between" }}>
      <Text>Pidetäänkö seuranta päällä? </Text>
      <Switch
        value={isTrackingEnabled}
        onValueChange={setIsTrackingEnabled}
      />
     
      <Text>{isTrackingEnabled ? "Päällä" : "Poissa"}</Text>
      </View>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
      >  
  
      {(userPosition ?? home) != null ? (
        <Marker
          coordinate={{
            latitude: userPosition?.latitude ?? home!.lat,
            longitude: userPosition?.longitude ?? home!.lng,
          }}
          title="Käyttäjän sijainti"
        />
      ) : null}

      {home != null ? (
        <Circle
          center={{ latitude: home.lat, longitude: home.lng }}
          radius={home.radiusMeters ?? 0}
          strokeColor="rgba(255, 0, 242, 0.8)"
          fillColor="rgba(255, 0, 0, 0.2)"
        />
      ) : null}

  </MapView>

      
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        <Text>{status}</Text>
        <Text>Koti on määritetty: {home ? `${home.lat}, ${home.lng}` : "–"}</Text>
        <Text>Etäisyys kotiin: {distanceM == null ? "–" : `${Math.round(distanceM)} m`}</Text>
        <Text>Turvallisuus alueen säde: {home?.radiusMeters} m</Text>
        <Text>Käyttäjä on turva-alueen: {inside ? "SISÄLLÄ" : "ULKONA"}</Text>
        <Text>TODO: Kun käyttäjä poistuu turva-alueen sisältä, sovellus lähettää varoituksen adminille.</Text>
    
      </View>
    </View>
  );
}
