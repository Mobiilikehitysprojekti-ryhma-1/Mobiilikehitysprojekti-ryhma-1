import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IconButton, useTheme } from "react-native-paper";
import { AdminHomeStackParamList } from "../../../features/admin/navigation/types";

export function SettingsButton() {
	const theme = useTheme();
	const navigation = useNavigation<NativeStackNavigationProp<AdminHomeStackParamList>>();

	return (
		<IconButton
			icon="cog"
			iconColor={theme.colors.primary}
			containerColor={theme.colors.onPrimary}
			size={24}
			onPress={() => navigation.navigate("Settings")}
		/>
	);
}