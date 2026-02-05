import { View, ScrollView } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { logout } from "../../auth/state/authActions";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useAuth } from "../../../shared/hooks/useAuth";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";

export default function SettingsScreen() {
	const theme = useTheme();
	const { mode, setMode, resetToModePicker } = useAppMode();
	const { user } = useAuth();
	const oletustilaLabel = mode === "admin" ? "Admin" : "Käyttäjä";

	return (
		<ScrollView
			style={{
				flex: 1,
				backgroundColor: theme.colors.primaryContainer,
			}}
			contentContainerStyle={{
				paddingTop: 24,
				padding: 16,
				gap: 12,
			}}
		>
			<Text
				style={{ color: theme.colors.onPrimary }}
				variant="headlineSmall"
			>
				Asetukset
			</Text>

			<Text
				style={{
					fontWeight: "bold",
					color: theme.colors.onPrimary,
					opacity: 0.9,
					marginTop: 8,
				}}
				variant="bodySmall"
			>
				User ID: {user?.uid}
			</Text>
			<Text
				style={{ color: theme.colors.onPrimary, opacity: 0.9 }}
				variant="bodySmall"
			>
				Nykyinen oletustila: {oletustilaLabel}
			</Text>

			<PrimaryButton
				mode="contained"
				buttonColor={theme.colors.secondary}
				textColor={theme.colors.onSecondary}
				onPress={() => setMode("admin")}
			>
				Siirry ADMIN näkymään
			</PrimaryButton>
			<PrimaryButton
				mode="outlined"
				buttonColor={theme.colors.error}
				textColor={theme.colors.onError}
				onPress={resetToModePicker}
			>
				Tyhjennä oletustila (poista tallennettu valinta)
			</PrimaryButton>
			<PrimaryButton
				mode="contained"
				buttonColor={theme.colors.secondary}
				textColor={theme.colors.onSecondary}
				onPress={logout}
			>
				Kirjaudu ulos tililtä
			</PrimaryButton>
		</ScrollView>
	);
}
