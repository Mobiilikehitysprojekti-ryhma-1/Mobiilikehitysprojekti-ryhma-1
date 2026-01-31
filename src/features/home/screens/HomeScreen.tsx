import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { logout } from "../../auth/state/authActions";
import { useAppMode } from "../../../shared/context/appModeContext";

export default function HomeScreen() {
    const { setMode } = useAppMode();

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content title="Aloitus" />
            </Appbar.Header>

            <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
                <Text variant="headlineMedium">Kirjautunut</Text>
                <Button mode="contained" onPress={() => setMode("admin")}>
                    Siirry Adminiin
                </Button>
                <Button mode="contained" onPress={logout}>
                    Kirjaudu ulos
                </Button>
            </View>
        </View>
    );
}
