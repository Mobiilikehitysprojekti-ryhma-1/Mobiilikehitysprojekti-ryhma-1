import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

export default function SafetyScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Turvallisuus" />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text variant="bodyLarge" style={{ textAlign: "center", color: "#666" }}>
          Turvallisuus – tulossa myöhemmin
        </Text>
      </View>
    </View>
  );
}
