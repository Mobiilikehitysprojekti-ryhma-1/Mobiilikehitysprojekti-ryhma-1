import React, { useState, useEffect } from "react";
import { TextInput, View, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { useLocation } from "../state/locationStore";
import { useAuth } from "../../../shared/hooks/useAuth";

type Props = BottomTabScreenProps<AdminStackParamList, "LocationSettings">;

export function LocationSettingsScreen({}: Props) {
	const { user } = useAuth();
	const location = useLocation(user?.uid);

	// Load existing location when screen comes into focus (real-time updates)
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
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text variant="headlineSmall" style={styles.title}>
					Set location settings
				</Text>

				{/* Current Location Display */}
				
					<View style={styles.currentLocationCard}>
						<Text variant="titleMedium" style={styles.cardTitle}>
							Tietokannassa oleva osoite on:
						</Text>
						{location.location?.home ? (
							<>
								<Text variant="bodyMedium">
									Latitude: {location.location.home.lat.toFixed(6)}
								</Text>
								<Text variant="bodyMedium">
									Longitude: {location.location.home.lng.toFixed(6)}
								</Text>
								<Text variant="bodyMedium">
									Radius: {location.location.home.radiusMeters} meters
								</Text>
								{location.location.home.address && (
									<Text variant="bodyMedium" style={styles.formattedAddress}>
										Address: {location.location.home.address}
									</Text>
								)}
							</>
						) : (
							<Text variant="bodyMedium">No location data saved</Text>
						)}
					</View>
				

				{/* Error Display */}
				{location.error && (
					<View style={styles.errorCard}>
						<Text variant="bodyMedium" style={styles.errorText}>
							{location.error}
						</Text>
					</View>
				)}

			
				
				{/* Address Input */}
				<Text variant="bodyMedium" style={styles.label}>
					Enter address
				</Text>
				<TextInput
					style={styles.input}
					value={address}
					onChangeText={setAddress}
					placeholder="Mannerheimintie 1, Helsinki, Finland"
					editable={!isLoading}
					multiline
				/>

				{/* Radius Input */}
				<Text variant="bodyMedium" style={styles.label}>
					Safety radius (meters)
				</Text>
				<TextInput
					style={styles.input}
					value={radius}
					onChangeText={setRadius}
					placeholder="150"
					keyboardType="numeric"
					editable={!isLoading}
				/>

				{/* Geocode and Save Button */}
				<Button
					mode="contained"
					onPress={handleGeocodeAndSave}
					disabled={isLoading || !address.trim() || !radius.trim()}
					style={styles.button}
					loading={isLoading}
				>
					{isLoading ? "Processing..." : "Geocode and Save Location"}
				</Button>

				{isLoading && (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="small" />
						<Text variant="bodySmall" style={styles.loadingText}>
							Geocoding address...
						</Text>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 16,
		gap: 12,
	},
	title: {
		marginBottom: 8,
	},
	currentLocationCard: {
		backgroundColor: "#e3f2fd",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
	cardTitle: {
		fontWeight: "bold",
		marginBottom: 8,
	},
	formattedAddress: {
		marginTop: 8,
		fontStyle: "italic",
	},
	errorCard: {
		backgroundColor: "#ffebee",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
	errorText: {
		color: "#c62828",
	},
	label: {
		marginTop: 8,
		marginBottom: 4,
		fontWeight: "500",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 12,
		borderRadius: 8,
		backgroundColor: "#fff",
		minHeight: 44,
	},
	button: {
		marginTop: 8,
	},
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginTop: 8,
	},
	loadingText: {
		color: "#666",
	},
});
