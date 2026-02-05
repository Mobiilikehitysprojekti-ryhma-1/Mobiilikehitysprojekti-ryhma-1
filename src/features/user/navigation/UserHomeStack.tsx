import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { UserHomeStackParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator<UserHomeStackParamList>();

function SettingsButton() {
	const theme = useTheme();
	const navigation = useNavigation<NativeStackNavigationProp<UserHomeStackParamList>>();

	return (
		<IconButton
			icon="cog"
			iconColor={theme.colors.onPrimary}
			size={24}
			onPress={() => navigation.navigate("Settings")}
		/>
	);
}

export function UserHomeStack() {
	const theme = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.colors.primaryContainer,
				},
				headerTintColor: theme.colors.onPrimary,
			}}
		>
			<Stack.Screen
				name="UserHome"
				component={HomeScreen}
				options={{
					title: "USER home",
					headerRight: () => <SettingsButton />,
				}}
			/>
			<Stack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					title: "Asetukset",
				}}
			/>
		</Stack.Navigator>
	);
}
