import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import type { AdminHomeStackParamList } from "./types";
import { AdminHomeScreen } from "../screens/AdminHomeScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator<AdminHomeStackParamList>();

export function AdminHomeStack() {
	const theme = useTheme();

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="AdminHomeMain"
				component={AdminHomeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					headerShown: true,
					title: "Settings",
					headerTransparent: true,
					headerTintColor: '#fff',
				}}
			/>
		</Stack.Navigator>
	);
}
