import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AdminStackParamList } from "../../shared/types/Navigation";

import AdminHomeScreen from "../../features/auth/screens/AdminHomeScreen";
// Commented out since I dont have these:
//import { MealScheduleScreen } from "../../features/admin/screens/MealScheduleScreen";
//import { MedScheduleScreen } from "../../features/admin/screens/MedScheduleScreen";
//import { LocationSettingsScreen } from "../../features/admin/screens/LocationSettingsScreen";

const Tab = createBottomTabNavigator<AdminStackParamList>();

export default function AdminStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} options={{
        title: "Admin home",
        headerShown: false
      }} />
    </Tab.Navigator>
  );
}
/* Commented out since I dont have these
  return (
    <Tab.Navigator>
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: "Admin home" }} />
      <Tab.Screen name="MealSchedule" component={MealScheduleScreen} options={{ title: "Meal Schedule" }} />
      <Tab.Screen name="MedSchedule" component={MedScheduleScreen} options={{ title: "Med Schedule" }} />
      <Tab.Screen name="LocationSettings" component={LocationSettingsScreen} options={{ title: "Location Settings" }} />
    </Tab.Navigator>
  ); 
  */
