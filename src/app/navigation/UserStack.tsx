import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { UserStackParamList } from "../../features/user/navigation/types";
import { UserHomeStack } from "../../features/user/navigation/UserHomeStack";
import MeasurementsScreen from "../../features/user/screens/MeasurementsScreen";
import SafetyScreen from "../../features/user/screens/SafetyScreen";
import { Icon } from "react-native-paper";


const Tab = createBottomTabNavigator<UserStackParamList>();

export function UserStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={UserHomeStack} options={{
        title: "Home",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon source="home" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Measurements" component={MeasurementsScreen} options={{
        title: "Camera",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon source="camera" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Safety" component={SafetyScreen} options={{
        title: "GPS",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon source="map-marker" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  );
}
