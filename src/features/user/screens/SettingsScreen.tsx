import { View } from "react-native";
import { logout } from "../../auth/state/authActions";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useAuth } from "../../../shared/hooks/useAuth";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";

export default function SettingsScreen() {
	const theme = useAppTheme();
	const { spacing, width, height, colors } = theme;
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
				<PrimaryButton style={{ backgroundColor: colors.error }} onPress={resetToModePicker}>
					Remove default app mode
				</PrimaryButton>

				<BodyText marginTop="medium" variant="bodyMedium" style={{ alignSelf: "center" }}>
					Current default mode: {oletustilaLabel}
				</BodyText>
			</View>
		</ScreenWrapper>
	);
}
