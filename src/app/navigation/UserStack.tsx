import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { UserStackParamList } from "../../features/user/navigation/types";
import HomeScreen from "../../features/user/screens/HomeScreen";
import MeasurementsScreen from "../../features/user/measurements/screens/MeasurementsScreen";
import SafetyScreen from "../../features/user/safety/screens/SafetyScreen";
import TasksScreen from "../../features/user/tasks/screens/TasksScreen";

const Tab = createBottomTabNavigator<UserStackParamList>();

export function UserStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "USER home" }} />
      <Tab.Screen name="Measurements" component={MeasurementsScreen} options={{ title: "Mittaukset" }} />
      <Tab.Screen name="Safety" component={SafetyScreen} options={{ title: "Turvallisuus" }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: "Tehtävät" }} />
    </Tab.Navigator>
  );
}
