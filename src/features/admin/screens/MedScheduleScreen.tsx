import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useMeds } from "../state/medsStore";

type Props = BottomTabScreenProps<AdminStackParamList, "MedSchedule">;

export function MedScheduleScreen({}: Props) {
	// kuka on kirjautunut
	const { user } = useAuth();
	// state layer - hallitsee lääkkeiden tila ja kutsut data layeriin
	const { meds, loading, error, loadMeds, saveMeds, updateMedTime } = useMeds(user?.uid);
	const [saving, setSaving] = useState(false);

	// Lataa lääkkeet kun näkymä avataan tai käyttäjä vaihtuu
	useEffect(() => {
		if (user) {
			loadMeds();
		}
	}, [user, loadMeds]);

	if (!user) return null;
	if (loading && !meds) {
		return (
			<View style={styles.container}>
				<Text variant="bodyMedium">Loading...</Text>
			</View>
		);
	}

	if (!meds) {
		return (
			<View style={styles.container}>
				<Text variant="bodyMedium" style={{ color: "red" }}>
					{error || "Failed to load medications"}
				</Text>
			</View>
		);
	}

	const handleSave = async () => {
		if (!meds) return;
		setSaving(true);
		try {
			await saveMeds(meds);
		} catch (error) {
			// Error is handled by the store
		} finally {
			setSaving(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text variant="headlineSmall">Set medication times</Text>
			
			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meds.morning.label}</Text>
				<TextInput
					style={styles.input}
					value={meds.morning.time}
					onChangeText={(time) => updateMedTime("morning", time)}
					placeholder="HH:MM"
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meds.noon.label}</Text>
				<TextInput
					style={styles.input}
					value={meds.noon.time}
					onChangeText={(time) => updateMedTime("noon", time)}
					placeholder="HH:MM"
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meds.evening.label}</Text>
				<TextInput
					style={styles.input}
					value={meds.evening.time}
					onChangeText={(time) => updateMedTime("evening", time)}
					placeholder="HH:MM"
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meds.night.label}</Text>
				<TextInput
					style={styles.input}
					value={meds.night.time}
					onChangeText={(time) => updateMedTime("night", time)}
					placeholder="HH:MM"
					keyboardType="numeric"
				/>
			</View>

			{error && (
				<Text variant="bodyMedium" style={{ color: "red" }}>
					{error}
				</Text>
			)}
			<Button 
				mode="contained" 
				onPress={handleSave}
				loading={saving || loading}
				disabled={saving || loading}
			>
				Save
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 12,
	},
	inputGroup: {
		gap: 4,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 4,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#fff",
	},
});
