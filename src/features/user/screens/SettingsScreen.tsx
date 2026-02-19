import { View, ScrollView } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { logout } from "../../auth/state/authActions";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useAuth } from "../../../shared/hooks/useAuth";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";

export default function SettingsScreen() {
	const theme = useTheme();
	const { spacing, width } = useAppTheme();
	const { mode, resetToModePicker } = useAppMode();
	const { user } = useAuth();
	const oletustilaLabel = mode === "admin" ? "Admin" : "Käyttäjä";

	return (
		<ScreenWrapper>
			<View style={{
				marginTop: spacing.extraLarge + 80,
				right: spacing.medium,
				zIndex: 10
			}}>
			</View>

			<PrimaryButton onPress={logout}>
				Log out
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
