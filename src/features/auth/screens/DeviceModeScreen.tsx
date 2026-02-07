import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { chooseDeviceMode } from "../state/authSession";

export default function DeviceModeScreen() {
    return (
        <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
            <Text variant="headlineMedium">Select this device's usage mode</Text>

            <Button mode="contained" onPress={() => chooseDeviceMode("caregiver")}>
                Caregiver
            </Button>

            <Button mode="outlined" onPress={() => chooseDeviceMode("careRecipient")}>
                Care Recipient
            </Button>
        </View>
    );
}
