import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { useLocation } from "../state/locationStore";
import { useAuth } from "../../../shared/hooks/useAuth";

import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";
import MapView, { Circle, Marker } from "react-native-maps";
import { useSafetyScreen } from "../../user/state/safetyScreenStore";
import { CustomSlider } from "../../../shared/components/Slider";

const DEFAULT_DELTA = 0.004;
const FALLBACK_CENTER = { latitude: 60.1699, longitude: 24.9384 };

type Props = BottomTabScreenProps<AdminStackParamList, "LocationSettings">;

export function LocationSettingsScreen({ }: Props) {
	const theme = useAppTheme();
	const { spacing, colors } = theme;
	const { user } = useAuth();

	const location = useLocation(user?.uid);
	const mapRef = useRef<MapView>(null);
	const { home, userPosition } = useSafetyScreen(user?.uid ?? null);
	const initialRegion = {
		latitude: home?.lat ?? userPosition?.latitude ?? FALLBACK_CENTER.latitude,
		longitude: home?.lng ?? userPosition?.longitude ?? FALLBACK_CENTER.longitude,
		latitudeDelta: DEFAULT_DELTA,
		longitudeDelta: DEFAULT_DELTA,
	};

	useFocusEffect(
		React.useCallback(() => {
			if (user?.uid) {
				location.loadLocation();
			}
		}, [user?.uid, location.loadLocation])
	);

	const [address, setAddress] = useState("");
	const [radius, setRadius] = useState("");
	const [formattedAddress, setFormattedAddress] = useState<string | null>(null);
	const [geocoding, setGeocoding] = useState(false);

	// Update radius and address when location is loaded
	useEffect(() => {
		if (location.location?.home) {
			setRadius(location.location.home.radiusMeters.toString());
			if (location.location.home.address) {
				setFormattedAddress(location.location.home.address);
			}

			if (mapRef.current) {
				mapRef.current.animateToRegion({
					latitude: location.location.home.lat,
					longitude: location.location.home.lng,
					latitudeDelta: DEFAULT_DELTA,
					longitudeDelta: DEFAULT_DELTA,
				}, 500);
			}
		}
	}, [location.location]);

	const handleGeocodeAndSave = async () => {
		// Validate inputs
		if (!address.trim()) {
			Alert.alert("Error", "Please enter an address");
			return;
		}

		const radiusValue = parseFloat(radius);
		if (isNaN(radiusValue) || radiusValue <= 0) {
			Alert.alert("Error", "Please enter a valid radius in meters");
			return;
		}

		setGeocoding(true);
		setFormattedAddress(null);

		try {
			const result = await location.geocodeAndSave(address.trim(), radiusValue);

			if (result.formattedAddress) {
				setFormattedAddress(result.formattedAddress);
				Alert.alert("Success", "Location saved successfully!");
			}
		} catch (error: any) {
			Alert.alert("Error", error.message || "Failed to save location");
		} finally {
			setGeocoding(false);
		}
	};


	const isLoading = location.loading || geocoding;
	const hasLocation = location.location?.home !== undefined;

	return (
		<ScreenWrapper>
			<View style={{ top: spacing.extraLarge }}>

				<HeaderText marginBottom="extraLarge">
					Location Settings
				</HeaderText>
				<View style={{ backgroundColor: colors.secondary + "72", padding: spacing.large, marginBottom: spacing.extraSmall }}>
					{/* Error Display */}
					{location.error && (
						<View>
							<BodyText>
								{location.error}
							</BodyText>
						</View>
					)}

					{/* Address Input */}
					<HeaderText marginBottom="small">
						Home address
					</HeaderText>
					<FlatInputField
						value={address}
						onChangeText={setAddress}
						placeholder="Mannerheimintie 1, Helsinki, Finland"
						editable={!isLoading}
						multiline
						style={{ marginBottom: spacing.medium }}
					/>
				</View>
				<View style={{ backgroundColor: colors.secondary + "72", paddingLeft: spacing.large, paddingRight: spacing.large, paddingBottom: spacing.medium, paddingTop: spacing.small, marginBottom: spacing.medium }}>
					<HeaderText marginBottom="small">
						Safety radius
					</HeaderText>

					<BodyText>
						Current radius: {radius}m
					</BodyText>

					<CustomSlider
						value={parseFloat(radius) || 0}
						onValueChange={(value: number) => setRadius(value.toString())}
						minimumValue={5}
						maximumValue={500}
						step={10}
						disabled={isLoading}
					/>

					<SecondaryButton
						style={{ marginTop: spacing.small }}
						onPress={handleGeocodeAndSave}
						disabled={isLoading || !address.trim() || !radius.trim()}
						loading={isLoading}
					>
						{isLoading ? "Processing..." : "Save Location"}
					</SecondaryButton>

					{isLoading && (
						<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.small }}>
							<ActivityIndicator size="small" />
							<BodyText marginLeft="small">
								Geocoding address...
							</BodyText>
						</View>
					)}
				</View>
				{/* Current Location Display */}
				<MapView
					ref={mapRef}
					style={{ height: spacing.extraLarge * 7, marginTop: spacing.extraSmall }}
					initialRegion={initialRegion}
				>
					{/* 1. The Saved Home Marker */}
					{home && (
						<Marker
							coordinate={{ latitude: home.lat, longitude: home.lng }}
							title="Saved Home Location"
						/>
					)}

					{/* 2. The Safety Circle around Home */}
					{home && (
						<Circle
							center={{ latitude: home.lat, longitude: home.lng }}
							radius={parseFloat(radius) || home.radiusMeters || 0}
							strokeColor={colors.primary}
							fillColor={colors.primary + "33"}
						/>
					)}
				</MapView>

				<View style={{ padding: spacing.small, backgroundColor: colors.secondary + "72", borderRadius: 0, opacity: hasLocation ? 1 : 0.5 }}>
					<BodyText >
						Currently saved location:
					</BodyText>
					{location.location?.home ? (
						<>
							{location.location.home.address && (
								<BodyText variant="bodyMedium">
									Address: {location.location.home.address}
								</BodyText>
							)}

							<BodyText variant="bodyMedium">
								Safety Radius: {location.location.home.radiusMeters} meters
							</BodyText>
						</>
					) : (
						<BodyText variant="bodyMedium">No location data saved</BodyText>
					)}
				</View>
			</View>
		</ScreenWrapper>
	);
}
