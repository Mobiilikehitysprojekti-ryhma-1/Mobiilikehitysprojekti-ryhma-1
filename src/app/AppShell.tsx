import React from "react";
import { Theme } from "../shared/theme/colors";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
import { initAuthListener, lockApp } from "../features/auth/state/authSession";

export default function AppShell() {
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const unsub = initAuthListener(() => setBooting(false));

        const sub = AppState.addEventListener("change", (next) => {
            if (next === "background" || next === "inactive") {
                lockApp();
            }
        });

        return () => {
            unsub();
            sub.remove();
        };
    }, []);

    if (booting) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <PaperProvider theme={Theme}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </PaperProvider>
    );
}
