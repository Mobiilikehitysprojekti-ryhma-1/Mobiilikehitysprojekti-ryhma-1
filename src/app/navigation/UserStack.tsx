import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { UserStackParamList } from "../../features/user/navigation/types";
import { UserHomeStack } from "../../features/user/navigation/UserHomeStack";
import MeasurementsScreen from "../../features/user/screens/MeasurementsScreen";
import SafetyScreen from "../../features/user/screens/SafetyScreen";
import TasksScreen from "../../features/user/screens/TasksScreen";

const Tab = createBottomTabNavigator<UserStackParamList>();

export function UserStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={UserHomeStack} options={{ title: "USER home", headerShown: false }} />
      <Tab.Screen name="Measurements" component={MeasurementsScreen} options={{ title: "Mittaukset" }} />
      <Tab.Screen name="Safety" component={SafetyScreen} options={{ title: "Turvallisuus" }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: "Tehtävät" }} />
    </Tab.Navigator>
  );
}
