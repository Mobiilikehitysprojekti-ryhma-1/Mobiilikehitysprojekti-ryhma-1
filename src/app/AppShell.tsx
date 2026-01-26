import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
import { initAuthListener } from "../features/auth/state/authSession";

export default function AppShell() {
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const unsub = initAuthListener(() => setBooting(false));
        return unsub;
    }, []);

    if (booting) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <PaperProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </PaperProvider>
    );
}
