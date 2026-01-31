import React from "react";
import { Theme } from "../shared/theme/colors";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";

export default function AppShell() {
  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
          <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
