import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { logout } from "../../auth/state/authActions";

export default function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content title="Aloitus" />
            </Appbar.Header>

            <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
                <Text variant="headlineMedium">Kirjautunut</Text>
                <Button mode="contained" onPress={logout}>
                    Kirjaudu ulos
                </Button>
            </View>
        </View>
    );
}
