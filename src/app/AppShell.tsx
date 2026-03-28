import { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
import { initAuthListener } from "../features/auth/state/authSession";

import { AppLightTheme, AppDarkTheme } from '../shared/theme/theme';

export default function AppShell() {
    const [booting, setBooting] = useState(true);
    const colorScheme = useColorScheme();

    // If system is in dark mode, use dark theme, otherwise use light theme
    const theme = useMemo(() => {
        console.log("Color scheme changed:", colorScheme);
        return colorScheme === 'dark' ? AppDarkTheme : AppLightTheme;
    }, [colorScheme]);

    useEffect(() => {
        const unsub = initAuthListener(() => setBooting(false));
        return unsub;
    }, []);

    if (booting) {
        return (
            <PaperProvider theme={theme}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator />
                </View>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </PaperProvider>
    );
}
