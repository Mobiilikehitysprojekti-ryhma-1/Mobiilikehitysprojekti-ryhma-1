import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IconButton } from "react-native-paper";
import { AdminHomeStackParamList } from "../../../features/admin/navigation/types";
import { useAppTheme } from "../../theme/theme";

export function SettingsButton() {
	const theme = useAppTheme();
	const { colors } = theme;
	const navigation = useNavigation<NativeStackNavigationProp<AdminHomeStackParamList>>();

	return (
		<IconButton
			icon="cog"
			iconColor={colors.primary}
			containerColor={colors.onPrimary}
			size={24}
			onPress={() => navigation.navigate("Settings")}
		/>
	);
}