import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../../features/admin/navigation/types";
import { AdminHomeStack } from "../../features/admin/navigation/AdminHomeStack";
import { MealScheduleScreen } from "../../features/admin/screens/MealScheduleScreen";
import { MedScheduleScreen } from "../../features/admin/screens/MedScheduleScreen";
import { LocationSettingsScreen } from "../../features/admin/screens/LocationSettingsScreen";
import { MeasurementsHistoryScreen } from "../../features/admin/screens/MeasurementsHistoryScreen";
import { Icon } from "react-native-paper";

const Tab = createBottomTabNavigator<AdminStackParamList>();

export function AdminStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AdminHome" component={AdminHomeStack}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="MealSchedule" component={MealScheduleScreen}
        options={{
          title: "Meal Schedule",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="food-apple" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="MedSchedule" component={MedScheduleScreen}
        options={{
          title: "Med Schedule",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="medication" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="LocationSettings" component={LocationSettingsScreen}
        options={{
          title: "Location",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="map-marker" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="MeasurementsHistory" component={MeasurementsHistoryScreen}
        options={{
          title: "Measurements",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="history" color={color} size={size} />
          ),
        }} />
    </Tab.Navigator>
  );
}
