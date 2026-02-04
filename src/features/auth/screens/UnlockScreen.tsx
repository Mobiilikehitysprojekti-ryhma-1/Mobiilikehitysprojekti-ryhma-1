import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { requestUnlock } from "../state/authSession";
import { logout } from "../state/authActions";

export default function UnlockScreen() {
    return (
        <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
            <Text variant="headlineMedium">Avaa sovellus</Text>

            <Button mode="contained" onPress={() => requestUnlock()}>
                Open
            </Button>

            <Button mode="text" onPress={() => logout()}>
                Log out
            </Button>
        </View>
    );
}