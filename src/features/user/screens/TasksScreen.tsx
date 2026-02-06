import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

export default function TasksScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Tehtävät" />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text variant="bodyLarge" style={{ textAlign: "center", color: "#666" }}>
          Tehtävät – tulossa myöhemmin
        </Text>
      </View>
    </View>
  );
}
