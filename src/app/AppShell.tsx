import React from "react";
import { Theme } from "../shared/theme/colors";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import LoginNavigation from "./navigation/LoginStack";

export default function AppShell() {
  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
          <LoginNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
}
