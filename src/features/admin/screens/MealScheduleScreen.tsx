import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useMeals } from "../state/mealsStore";
import type { MealsItems } from "../data/mealsRepository";

type Props = BottomTabScreenProps<AdminStackParamList, "MealSchedule">;

export function MealScheduleScreen({}: Props) {
	// kuka on kirjautunut
	const { user } = useAuth();
	// state layer - hallitsee aterioiden tila ja kutsut data layeriin
	const { meals, loading, error, loadMeals, saveMeals, updateMealTime } = useMeals(user?.uid);
	const [saving, setSaving] = useState(false);

	// Lataa ateriat kun näkymä avataan tai käyttäjä vaihtuu
	useEffect(() => {
		if (user) {
			loadMeals();
		}
	}, [user, loadMeals]);

	if (!user) return null;
	if (loading && !meals) {
		return (
			<View style={styles.container}>
				<Text variant="bodyMedium">Loading...</Text>
			</View>
		);
	}

	if (!meals) {
		return (
			<View style={styles.container}>
				<Text variant="bodyMedium" style={{ color: "red" }}>
					{error || "Failed to load meals"}
				</Text>
			</View>
		);
	}

	const handleSave = async () => {
		if (!meals) return;
		setSaving(true);
		try {
			await saveMeals(meals);
		} catch (error) {
			// Error is handled by the store
		} finally {
			setSaving(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text variant="headlineSmall">Set meal times</Text>
			
			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meals.breakfast.label}</Text>
				<TextInput
					style={styles.input}
					value={meals.breakfast.time}
					onChangeText={(time) => updateMealTime("breakfast", time)}
					placeholder="HH:MM"
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meals.lunch.label}</Text>
				<TextInput
					style={styles.input}
					value={meals.lunch.time}
					onChangeText={(time) => updateMealTime("lunch", time)}
					placeholder="HH:MM"
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meals.dinner.label}</Text>
				<TextInput
					style={styles.input}
					value={meals.dinner.time}
					onChangeText={(time) => updateMealTime("dinner", time)}
					placeholder="HH:MM"
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.inputGroup}>
				<Text variant="bodyMedium">{meals.supper.label}</Text>
				<TextInput
					style={styles.input}
					value={meals.supper.time}
					onChangeText={(time) => updateMealTime("supper", time)}
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
