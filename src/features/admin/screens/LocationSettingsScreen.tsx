import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { Button, Text } from "react-native-paper";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";

type Props = BottomTabScreenProps<AdminStackParamList, "LocationSettings">;

export function LocationSettingsScreen({}: Props) {


	//Väliaikaiset
	const [address, setAddress] = useState("");
	const [radius, setRadius] = useState("");

	const handleGetLocation = () => {
		console.log("Get Location pitäis varmaan hakea tämän hetkinen sijainti");
	};

	const handleSave = () => {
		console.log("Save pitäis varmaan tallentaa sijainti ja säde");
	};

	return (
		<View style={{ padding: 16, gap: 12 }}>
			<Text variant="headlineSmall">Set location settings</Text>
			<Text variant="bodyMedium" style={{ fontWeight: "bold", color: "red" }}>Sijainti: {address}</Text>
			<Text variant="bodyMedium" style={{ fontWeight: "bold", color: "red" }}>Säde: {radius}</Text>
			<Text variant="bodyMedium">Haetaanko tämän hetkinen sijainti?</Text>
			<Button
				mode="contained"
				onPress={handleGetLocation}
			>
				Haetaan tämän hetkinen sijainti
			</Button>
			<Text variant="bodyMedium">Syötä osoite</Text>
			<TextInput style={{ borderWidth: 1, borderColor: "black", padding: 10, borderRadius: 5 }}
				value={address}
				onChangeText={setAddress}
			/>
			<Text variant="bodyMedium">Syötä säde (metriä)</Text>


			<TextInput
				style={{ borderWidth: 1, borderColor: "black", padding: 10, borderRadius: 5 }}
				value={radius}
				onChangeText={setRadius}
			/>
			<Button
				mode="contained"
				onPress={handleSave}
			>
				Save
			</Button>
		</View>
	);
}
