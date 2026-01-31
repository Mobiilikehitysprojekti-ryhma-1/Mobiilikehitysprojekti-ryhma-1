import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAppMode } from "../../shared/context/appModeContext";

type Props = {
  onChosen: () => void;
};

export default function ModePickerScreen({ onChosen }: Props) {
  const { setMode } = useAppMode();

  const choose = async (mode: "user" | "admin") => {
    await setMode(mode);
    onChosen();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valitse oletustila: Käyttäjä tai Admin</Text>
      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.userButton, pressed && styles.pressed]}
          onPress={() => choose("user")}
        >
          <Text style={styles.buttonText}>User</Text>
          <Text style={styles.hint}>Koti, Mittaukset, Turvallisuus, Tehtävät</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.adminButton, pressed && styles.pressed]}
          onPress={() => choose("admin")}
        >
          <Text style={styles.buttonText}>Admin</Text>
          <Text style={styles.hint}>Ruoka, Lääkkeet, Sijainti</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 32,
    color: "#333",
  },
  buttons: {
    gap: 16,
    width: "100%",
    maxWidth: 280,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  userButton: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#2196f3",
  },
  adminButton: {
    backgroundColor: "#e8f5e9",
    borderWidth: 2,
    borderColor: "#4caf50",
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
