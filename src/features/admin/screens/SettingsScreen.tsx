import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { logout } from "../../auth/state/authActions";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useMeals } from "../state/mealsStore";
import { useMeds } from "../state/medsStore";
import { useLocation } from "../state/locationStore";
import { useAdminHome } from "../state/adminHomeStore";
import { useDailyStatus } from "../state/dailyStatusStore";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import type { BPReading, BPStatus } from "../data/dailyStatusRepository";
import { useAppTheme } from "../../../shared/theme/theme";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useNavigation } from "@react-navigation/native";

export function SettingsScreen() {
	const theme = useTheme();
	const { spacing, width, height } = useAppTheme();
	const { user } = useAuth();
	const { mode, resetToModePicker } = useAppMode();
	const oletustilaLabel = mode === "admin" ? "Admin" : "Käyttäjä";
	const navigation = useNavigation<any>();
	const goToPasswordManagement = () => {
		navigation.navigate("PasswordManagement");
	};

	// State layer - handles all business logic and data access
	const adminHome = useAdminHome(user?.uid);
	const meals = useMeals(user?.uid);
	const meds = useMeds(user?.uid);
	const location = useLocation(user?.uid);
	const dailyStatus = useDailyStatus(user?.uid, 2); // Load last 2 days (today + yesterday)

	const [isGeneratingBP, setIsGeneratingBP] = useState(false);
	const [bpGenerationStatus, setBpGenerationStatus] = useState<string | null>(null);

	// Helper function to generate realistic BP readings
	const generateBPReading = (baseSys: number = 120, baseDia: number = 80, basePulse: number = 70): BPReading => {
		// Add some variation: ±10 for sys, ±5 for dia, ±10 for pulse
		const sys = baseSys + Math.floor(Math.random() * 21) - 10; // 110-130
		const dia = baseDia + Math.floor(Math.random() * 11) - 5; // 75-85
		const pulse = basePulse + Math.floor(Math.random() * 21) - 10; // 60-80
		return { sys, dia, pulse };
	};

	// Generate blood pressure history test data for last 14 days
	const generateBPHistoryTestData = async () => {
		if (!user?.uid) {
			setBpGenerationStatus("Virhe: Käyttäjää ei löydy");
			return;
		}

		setIsGeneratingBP(true);
		setBpGenerationStatus(null);

		try {
			const today = new Date();
			let successCount = 0;
			let errorCount = 0;

			console.log("Generating BP history test data for 14 days...");

			// Generate data for each of the last 14 days
			for (let i = 0; i < 14; i++) {
				const date = new Date(today);
				date.setDate(date.getDate() - i);
				const dateStr = date.toISOString().split("T")[0];

				// Generate slightly different base values for variety
				// Older days might have slightly higher values (simulating improvement over time)
				const dayOffset = i;
				const baseSys = 125 - Math.floor(dayOffset * 0.5); // Slightly decreasing trend
				const baseDia = 82 - Math.floor(dayOffset * 0.3);
				const basePulse = 72 - Math.floor(dayOffset * 0.2);

				// Morning reading (typically slightly higher)
				const morningReading = generateBPReading(baseSys + 2, baseDia + 1, basePulse);
				const morningStatus: BPStatus = morningReading.sys !== null && morningReading.dia !== null ? "ok" : "pending";

				// Evening reading (typically slightly lower)
				const eveningReading = generateBPReading(baseSys - 2, baseDia - 1, basePulse - 2);
				const eveningStatus: BPStatus = eveningReading.sys !== null && eveningReading.dia !== null ? "ok" : "pending";

				try {
					await dailyStatus.saveDailyStatus({
						date: dateStr,
						meals: {
							breakfast: "ok",
							lunch: "ok",
							dinner: "ok",
							supper: "ok",
						},
						meds: {
							morning: "ok",
							noon: "ok",
							evening: "ok",
							night: "ok",
						},
						location: {
							stayedInArea: true,
							breaches: 0,
						},
						bloodPressure: {
							morning: {
								reading: morningReading,
								status: morningStatus,
							},
							evening: {
								reading: eveningReading,
								status: eveningStatus,
							},
						},
					});
					successCount++;
					console.log(`✓ Generated BP data for ${dateStr}`);
				} catch (err: any) {
					errorCount++;
					console.error(`✗ Error generating BP data for ${dateStr}:`, err.message || err);
				}
			}

			const message = `Valmis! Luotu ${successCount}/14 päivää. ${errorCount > 0 ? `Virheitä: ${errorCount}` : ""}`;
			setBpGenerationStatus(message);
			console.log(message);
		} catch (error: any) {
			const errorMsg = `Virhe BP-historiaa luotaessa: ${error.message || error}`;
			setBpGenerationStatus(errorMsg);
			console.error(errorMsg);
		} finally {
			setIsGeneratingBP(false);
		}
	};

	// Test function - uses state layer instead of direct repository calls
	const runTest = async () => {
		if (!user) return;

		try {
			// 1) setMeals via state layer
			await meals.saveMeals({
				breakfast: { label: "Aamupala", time: "08:00" },
				lunch: { label: "Lounas", time: "12:00" },
				dinner: { label: "Päivällinen", time: "17:00" },
				supper: { label: "Iltapala", time: "20:00" },
			});

			// 2) getMeals via state layer
			await meals.loadMeals();
			console.log("MEALS:", meals.meals);

			// 3) setMeds via state layer
			await meds.saveMeds({
				morning: { label: "Aamulääke", time: "08:30" },
				noon: { label: "Päivälääke", time: "12:30" },
				evening: { label: "Iltalääke", time: "18:30" },
				night: { label: "Yölääke", time: "22:00" },
			});

			// 4) getMeds via state layer
			await meds.loadMeds();
			console.log("MEDS:", meds.meds);

			// 5) Test geocoding with an address (like the real version)
			console.log("Testing geocoding with address...");
			let geocodeResult = null;
			try {
				geocodeResult = await location.geocodeAndSave(
					"Mannerheimintie 1, Helsinki, Finland",
					150
				);

				if (geocodeResult && geocodeResult.success) {
					console.log("✓ Geocoding successful!");
					console.log("  Formatted Address:", geocodeResult.formattedAddress);
					console.log("  Latitude:", geocodeResult.lat);
					console.log("  Longitude:", geocodeResult.lng);
					if (geocodeResult.addressComponents) {
						console.log("  Address Components:", geocodeResult.addressComponents);
					}
				} else {
					console.error("✗ Geocoding failed:", geocodeResult?.error);
				}
			} catch (err: any) {
				console.error("✗ Geocoding test error:", err.message || err);
			}

			// 6) Load location from database and display like real version
			await location.loadLocation();

			if (location.error) {
				console.error("✗ Error loading location:", location.error);
			} else if (location.location?.home) {
				console.log("✓ Location loaded from database:");
				console.log("  Tietokannassa oleva osoite on:");
				console.log("    Latitude:", location.location.home.lat.toFixed(6));
				console.log("    Longitude:", location.location.home.lng.toFixed(6));
				console.log("    Radius:", location.location.home.radiusMeters, "meters");
				if (location.location.home.address) {
					console.log("    Address:", location.location.home.address);
				}
				console.log("    Enabled:", location.location.enabled);
			} else {
				console.log("✗ No location data found in database");
			}

			// 7) Create sample daily status for today and yesterday
			const today = new Date();
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);

			const todayStr = today.toISOString().split("T")[0];
			const yesterdayStr = yesterday.toISOString().split("T")[0];

			console.log("Creating daily status for:", todayStr, "and", yesterdayStr);

			// Today's status (some pending items)
			try {
				await dailyStatus.saveDailyStatus({
					date: todayStr,
					meals: {
						breakfast: "ok",
						lunch: "ok",
						dinner: "pending",
						supper: "pending",
					},
					meds: {
						morning: "ok",
						noon: "ok",
						evening: "pending",
						night: "pending",
					},
					location: {
						stayedInArea: true,
						breaches: 0,
					},
				});
				console.log("Today's status saved successfully");
			} catch (err: any) {
				console.error("Error saving today's status:", err);
				console.error("Error details:", err.message, err.code);
			}

			// Yesterday's status (all completed)
			try {
				await dailyStatus.saveDailyStatus({
					date: yesterdayStr,
					meals: {
						breakfast: "ok",
						lunch: "ok",
						dinner: "ok",
						supper: "not ok",
					},
					meds: {
						morning: "ok",
						noon: "not ok",
						evening: "ok",
						night: "ok",
					},
					location: {
						stayedInArea: true,
						breaches: 0,
					},
				});
				console.log("Yesterday's status saved successfully");
			} catch (err: any) {
				console.error("Error saving yesterday's status:", err);
				console.error("Error details:", err.message, err.code);
			}

			// 8) Reload daily status to see the new data
			await dailyStatus.loadDailyStatus();
			console.log("DAILY STATUS:", dailyStatus.statuses);
			if (dailyStatus.error) {
				console.error("Daily status error:", dailyStatus.error);
			}
		} catch (error) {
			console.error("Test error:", error);
		}
	};

	if (!user) {
		return (
			<View
				style={{
					flex: 1,
					padding: 16,
					gap: 12,
					backgroundColor: theme.colors.primaryContainer,
				}}
			>
				<BodyText variant="bodyMedium">
					No user found
				</BodyText>
			</View>
		);
	}

	return (
		<ScreenWrapper>
			<View style={{
				marginTop: spacing.extraLarge + 80,
				right: spacing.medium,
				zIndex: 10
			}}>
			</View>

			<PrimaryButton style={{ marginBottom: spacing.medium }} onPress={logout}>
				Log out
			</PrimaryButton>

			<PrimaryButton style={{ marginBottom: spacing.medium }} onPress={goToPasswordManagement}>
				Change password
			</PrimaryButton>

			<View
				style={{
					width: width.full,
					alignSelf: "center",
					marginTop: spacing.extraLarge + 30,
				}}>
				<PrimaryButton style={{ backgroundColor: theme.colors.error }} onPress={resetToModePicker}>
					Remove default app mode
				</PrimaryButton>

				<BodyText marginTop="medium" variant="bodyMedium" style={{ alignSelf: "center" }}>
					Current default mode: {oletustilaLabel}
				</BodyText>
			</View>

			{/* FIREBASE TESTIT
				<HeaderText
					style={{ marginTop: 16, marginBottom: 8, color: theme.colors.onPrimary }}
					variant="titleMedium"
				>
					Firebase Testit
				</HeaderText>

				<PrimaryButton
					disabled={adminHome.isChecking}
					buttonColor={theme.colors.secondary}
					textColor={theme.colors.onSecondary}
					onPress={adminHome.checkConnection}
				>
					{adminHome.isChecking ? "Checking..." : "Check Firebase Connection"}
				</PrimaryButton>

				{adminHome.connectionStatus ? (
					<BodyText
						style={{ marginTop: 8, color: theme.colors.onPrimary }}
						variant="bodyMedium"
					>
						{adminHome.connectionStatus}
					</BodyText>
				) : null}

				<PrimaryButton
					disabled={!user}
					buttonColor={theme.colors.secondary}
					textColor={theme.colors.onSecondary}
					onPress={runTest}
				>
					Testaa Firestore get/set testidatalla
				</PrimaryButton>

				<PrimaryButton 
					disabled={!user || isGeneratingBP}
					buttonColor={theme.colors.secondary}
					textColor={theme.colors.onSecondary}
					onPress={generateBPHistoryTestData}
				>
					{isGeneratingBP ? "Luodaan BP-historiaa..." : "Luo BP-historia (14 päivää)"}
				</PrimaryButton>

				{bpGenerationStatus ? (
					<BodyText
						style={{ marginTop: 8, color: theme.colors.onPrimary }}
						variant="bodyMedium"
					>
						{bpGenerationStatus}
					</BodyText>
				) : null}
*/}

		</ScreenWrapper>
	);
}
