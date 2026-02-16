import React, { useEffect, useState } from "react";
import { View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useMeds } from "../state/medsStore";

import { useTheme } from "react-native-paper";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";

type Props = BottomTabScreenProps<AdminStackParamList, "MedSchedule">;

export function MedScheduleScreen({ }: Props) {
	const theme = useTheme();
	const { spacing } = useAppTheme();
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
			<View>
				<BodyText variant="bodyMedium">Loading...</BodyText>
			</View>
		);
	}

	if (!meds) {
		return (
			<View>
				<BodyText variant="bodyMedium" style={{ color: "red" }}>
					{error || "Failed to load medications"}
				</BodyText>
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
			console.log("Saved meds:", meds);
		}
	};

	return (
		<ScreenWrapper>
			<View style={{ top: spacing.extraLarge, padding: spacing.large }}>
				<HeaderText marginBottom="extraLarge">Set medication times</HeaderText>

				<BodyText>{meds.morning.label}</BodyText>
				<FlatInputField
					value={meds.morning.time}
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

						updateMedTime("morning", formattedTime);
					}}

					placeholder="HH:MM"
					keyboardType="number-pad"
					maxLength={5} //format is always 5 chars (e.g. 08:00)
					style={{ marginBottom: spacing.medium }}
				/>
				{/* Repeat similar input logic for noon, evening, and night */}

				<BodyText>{meds.noon.label}</BodyText>
				<FlatInputField
					value={meds.noon.time}
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

						updateMedTime("noon", formattedTime);
					}}

					placeholder="HH:MM"
					keyboardType="number-pad"
					maxLength={5}
					style={{ marginBottom: spacing.medium }}
				/>


				<BodyText>{meds.evening.label}</BodyText>
				<FlatInputField
					value={meds.evening.time}
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

						updateMedTime("evening", formattedTime);
					}}

					placeholder="HH:MM"
					keyboardType="number-pad"
					maxLength={5}
					style={{ marginBottom: spacing.medium }}
				/>

				<BodyText>{meds.night.label}</BodyText>
				<FlatInputField
					value={meds.night.time}
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

						updateMedTime("night", formattedTime);
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
		</ScreenWrapper>
	);
}