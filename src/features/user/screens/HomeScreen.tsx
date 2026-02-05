import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useAuth } from "../../../shared/hooks/useAuth";

export default function HomeScreen() {
	const theme = useTheme();
	const { mode } = useAppMode();
	const { user } = useAuth();
	const oletustilaLabel = mode === "admin" ? "Admin" : "Käyttäjä";

	return (
		<View
			style={{
				flex: 1,
				paddingTop: 24,
				padding: 16,
				gap: 12,
				backgroundColor: theme.colors.primaryContainer,
			}}
		>
			<Text
				style={{ color: theme.colors.onPrimary }}
				variant="bodyMedium"
			>
				USER home screen
			</Text>
			<Text
				style={{
					fontWeight: "bold",
					color: theme.colors.onPrimary,
					opacity: 0.9,
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
		</View>
	);
}
