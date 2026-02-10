import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AdminHomeStackParamList } from "./types";
import { AdminHomeScreen } from "../screens/AdminHomeScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator<AdminHomeStackParamList>();

function SettingsButton() {
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

export function AdminHomeStack() {
	const theme = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerTransparent: true,
				headerShadowVisible: false,
				headerStyle: {
				backgroundColor: 'transparent',
				},
				headerTintColor: theme.colors.onPrimary,
			}}
		>
			<Stack.Screen
				name="AdminHomeMain"
				component={AdminHomeScreen}
				options={{
					animation: "none",
					title: "",
					headerRight: () => <SettingsButton />,
				}}
			/>
			<Stack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					title: "Settings",
					
				}}
			/>
		</Stack.Navigator>
	);
}
