import React, { useEffect, useState } from "react";
import { View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useMeals } from "../state/mealsStore";
import type { MealsItems } from "../data/mealsRepository";

import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";

type Props = BottomTabScreenProps<AdminStackParamList, "MealSchedule">;

export function MealScheduleScreen({ }: Props) {
	const theme = useAppTheme();
	const { spacing, width, height, colors } = theme;
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
			<View>
				<BodyText variant="bodyMedium">Loading...</BodyText>
			</View>
		);
	}

	if (!meals) {
		return (
			<View >
				<BodyText variant="bodyMedium" style={{ color: "red" }}>
					{error || "Failed to load meals"}
				</BodyText>
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
		<ScreenWrapper>
			<View style={{ top: spacing.extraLarge }}>
				<View style={{ backgroundColor: colors.secondary + "72", width: width.full, padding: spacing.large }}>
					<HeaderText marginBottom="extraLarge">Set meal times</HeaderText>

					<BodyText>{meals.breakfast.label}</BodyText>

					<FlatInputField
						value={meals.breakfast.time}
						onChangeText={(text) => {
							// Remove potential non-numeric chars
							let cleaned = text.replace(/[^0-9]/g, "");

							//Limit to 4 digits
							if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);

							//24-hour logic and formatting to e.g 08:00
							let formattedTime = cleaned;
							if (cleaned.length >= 1) {
								//First digit cant be above 2
								if (parseInt(cleaned[0]) > 2) formattedTime = "0";
							}
							if (cleaned.length >= 2) {
								// hours cant be above 23
								if (parseInt(cleaned.slice(0, 2)) > 23) {
									formattedTime = cleaned.slice(0, 1);
								} else {
									formattedTime = cleaned.slice(0, 2) + (cleaned.length > 2 ? ":" : "");
								}
							}

							if (cleaned.length >= 3) {
								// minutes cant be above 5
								if (parseInt(cleaned[2]) > 5) {
									formattedTime = cleaned.slice(0, 2) + ":";
								} else {
									formattedTime = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
									formattedTime = formattedTime.slice(0, 5);
								}
							}

							updateMealTime("breakfast", formattedTime);
						}}

						placeholder="HH:MM"
						keyboardType="number-pad"
						maxLength={5} //format is always 5 chars (e.g. 08:00)
						style={{ marginBottom: spacing.medium }}
					/>
					{/* Repeat similar input logic for lunch, dinner, and supper */}

					<BodyText>{meals.lunch.label}</BodyText>

					<FlatInputField
						value={meals.lunch.time}
						onChangeText={(text) => {
							let cleaned = text.replace(/[^0-9]/g, "");

							if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);

							let formattedTime = cleaned;
							if (cleaned.length >= 1) {
								if (parseInt(cleaned[0]) > 2) formattedTime = "0";
							}
							if (cleaned.length >= 2) {
								if (parseInt(cleaned.slice(0, 2)) > 23) {
									formattedTime = cleaned.slice(0, 1);
								} else {
									formattedTime = cleaned.slice(0, 2) + (cleaned.length > 2 ? ":" : "");
								}
							}

							if (cleaned.length >= 3) {
								if (parseInt(cleaned[2]) > 5) {
									formattedTime = cleaned.slice(0, 2) + ":";
								} else {
									formattedTime = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
									formattedTime = formattedTime.slice(0, 5);
								}
							}

							updateMealTime("lunch", formattedTime);
						}}

						placeholder="HH:MM"
						keyboardType="number-pad"
						maxLength={5}
						style={{ marginBottom: spacing.medium }}
					/>


					<BodyText>{meals.dinner.label}</BodyText>
					<FlatInputField
						value={meals.dinner.time}
						onChangeText={(text) => {
							let cleaned = text.replace(/[^0-9]/g, "");

							if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);

							let formattedTime = cleaned;
							if (cleaned.length >= 1) {
								if (parseInt(cleaned[0]) > 2) formattedTime = "0";
							}
							if (cleaned.length >= 2) {
								if (parseInt(cleaned.slice(0, 2)) > 23) {
									formattedTime = cleaned.slice(0, 1);
								} else {
									formattedTime = cleaned.slice(0, 2) + (cleaned.length > 2 ? ":" : "");
								}
							}

							if (cleaned.length >= 3) {
								if (parseInt(cleaned[2]) > 5) {
									formattedTime = cleaned.slice(0, 2) + ":";
								} else {
									formattedTime = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
									formattedTime = formattedTime.slice(0, 5);
								}
							}

							updateMealTime("dinner", formattedTime);
						}}

						placeholder="HH:MM"
						keyboardType="number-pad"
						maxLength={5}
						style={{ marginBottom: spacing.medium }}
					/>

					<BodyText>{meals.supper.label}</BodyText>
					<FlatInputField
						value={meals.supper.time}
						onChangeText={(text) => {
							let cleaned = text.replace(/[^0-9]/g, "");

							if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);

							let formattedTime = cleaned;
							if (cleaned.length >= 1) {
								if (parseInt(cleaned[0]) > 2) formattedTime = "0";
							}
							if (cleaned.length >= 2) {
								if (parseInt(cleaned.slice(0, 2)) > 23) {
									formattedTime = cleaned.slice(0, 1);
								} else {
									formattedTime = cleaned.slice(0, 2) + (cleaned.length > 2 ? ":" : "");
								}
							}

							if (cleaned.length >= 3) {
								if (parseInt(cleaned[2]) > 5) {
									formattedTime = cleaned.slice(0, 2) + ":";
								} else {
									formattedTime = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
									formattedTime = formattedTime.slice(0, 5);
								}
							}

							updateMealTime("supper", formattedTime);
						}}

						placeholder="HH:MM"
						keyboardType="number-pad"
						maxLength={5}
						style={{ marginBottom: spacing.extraLarge }}
					/>


					{error && (
						<BodyText variant="bodyMedium" style={{ color: "red" }}>
							{error}
						</BodyText>
					)}
					<SecondaryButton
						onPress={handleSave}
						loading={saving || loading}
						disabled={saving || loading}
						style={{ marginTop: spacing.extraLarge }}>
						Save
					</SecondaryButton>
				</View>
			</View>
		</ScreenWrapper>
	);
}
