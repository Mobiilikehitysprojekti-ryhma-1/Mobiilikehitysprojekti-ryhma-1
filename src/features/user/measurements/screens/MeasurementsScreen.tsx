import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

export default function MeasurementsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Mittaukset" />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text variant="bodyLarge" style={{ textAlign: "center", color: "#666" }}>
          Mittaukset – tulossa myöhemmin
        </Text>
      </View>
    </View>
  );
}
