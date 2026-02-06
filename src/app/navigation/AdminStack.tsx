import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../../features/admin/navigation/types";

import { AdminHomeStack } from "../../features/admin/navigation/AdminHomeStack";
import { MealScheduleScreen } from "../../features/admin/screens/MealScheduleScreen";
import { MedScheduleScreen } from "../../features/admin/screens/MedScheduleScreen";
import { LocationSettingsScreen } from "../../features/admin/screens/LocationSettingsScreen";
import { MeasurementsHistoryScreen } from "../../features/admin/screens/MeasurementsHistoryScreen";

const Tab = createBottomTabNavigator<AdminStackParamList>();

export function AdminStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AdminHome" component={AdminHomeStack} options={{ title: "Admin home", headerShown: false }} />
      <Tab.Screen name="MealSchedule" component={MealScheduleScreen} options={{ title: "Meal Schedule" }} />
      <Tab.Screen name="MedSchedule" component={MedScheduleScreen} options={{ title: "Med Schedule" }} />
      <Tab.Screen name="LocationSettings" component={LocationSettingsScreen} options={{ title: "Location Settings" }} />
      <Tab.Screen name="MeasurementsHistory" component={MeasurementsHistoryScreen} options={{ title: "Measurements History" }} />
    </Tab.Navigator>
  );
}
