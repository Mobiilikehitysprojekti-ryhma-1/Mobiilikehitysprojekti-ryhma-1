import React, { useEffect, useRef, useState } from "react";
import { Alert, Switch, View } from "react-native";

import { useAuth } from "../../../shared/hooks/useAuth";
import { useSafetyScreen } from "../state/safetyScreenStore";
import MapView, { Marker, Circle } from "react-native-maps";

import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";

// default delta is 0.004 degrees, which is approximately 400 meters at the equator

const DEFAULT_DELTA = 0.004;

// fallback center is Helsinki, Finland

const FALLBACK_CENTER = { latitude: 60.1699, longitude: 24.9384 };

export default function SafetyScreen() {
  const theme = useAppTheme();
  const { spacing, colors } = theme;
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
    <ScreenWrapper>
      <View style={{ top: spacing.extraLarge, padding: spacing.large }}>
        <HeaderText marginTop="large" marginBottom="medium">
          Turvallisuus
        </HeaderText>

        <View style={{ flexDirection: "row", backgroundColor: colors.secondary, padding: spacing.small, marginBottom: spacing.medium, alignItems: "center", justifyContent: "space-between" }}>
          <BodyText marginHorizontal="medium">Tracking: {isTrackingEnabled ? "Enabled" : "Disabled"}</BodyText>
          <Switch
            value={isTrackingEnabled}
            onValueChange={setIsTrackingEnabled}
            trackColor={{ false: colors.tertiary, true: colors.primary }}
          />

        </View>


        <MapView
          ref={mapRef}
          style={{ height: spacing.extraLarge * 10, marginTop: spacing.extraSmall }}
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


        <View style={{ padding: spacing.medium, justifyContent: "center", backgroundColor: colors.secondary }}>
          {error ? <BodyText style={{ color: "red" }}>{error}</BodyText> : null}
          <BodyText>{status}</BodyText>
          <BodyText>Koti on määritetty: {home ? `${home.lat}, ${home.lng}` : "–"}</BodyText>
          <BodyText>Etäisyys kotiin: {distanceM == null ? "–" : `${Math.round(distanceM)} m`}</BodyText>
          <BodyText>Turvallisuus alueen säde: {home?.radiusMeters} m</BodyText>
          <BodyText>Käyttäjä on turva-alueen: {inside ? "SISÄLLÄ" : "ULKONA"}</BodyText>

        </View>
      </View>
    </ScreenWrapper>
  );
}
