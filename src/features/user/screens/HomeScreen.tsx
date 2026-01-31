import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { logout } from "../../auth/state/authActions";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useAuth } from "../../../shared/hooks/useAuth";

export default function HomeScreen() {
    const { setMode, resetToModePicker } = useAppMode();
    const { user } = useAuth();
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content title="USER home" />
            </Appbar.Header>

            <View style={{ flex: 1, padding: 16, gap: 12 }}>

            <Text variant="bodyMedium">USER home screen</Text>
            <Text variant="bodySmall" style={{ fontWeight: "bold", color: "red" }}>User ID: {user?.uid}</Text>
                <Button mode="contained" onPress={() => setMode("admin")}>
                    Siirry ADMIN näkymään
                </Button>
                <Button mode="outlined" onPress={resetToModePicker}>
                    Valitse oletustila uudelleen (User/Admin)
                </Button>
                <Button mode="contained" onPress={logout}>
                    Kirjaudu ulos tililtä
                </Button>
            </View>
        </View>
    );
}
