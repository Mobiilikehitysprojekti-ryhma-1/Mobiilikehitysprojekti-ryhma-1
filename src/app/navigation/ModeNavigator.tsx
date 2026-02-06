import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAppMode } from "../../shared/context/appModeContext";
import { AdminStack } from "./AdminStack";
import ModePickerScreen from "./ModePickerScreen";
import { UserStack } from "./UserStack";

/**
 * After login: shows "Valitse oletustila" (User / Admin) the first time when no mode is stored.
 * Once chosen, shows either User stack (Home) or Admin stack. Choice is
 * saved and restored next session (picker is skipped when restored).
 */
export default function ModeNavigator() {
  const { mode, ready, restoredFromStorage } = useAppMode();
  const [chosen, setChosen] = useState(false);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Show picker when: first time (no stored preference) or user hasn't chosen this session
  const showPicker = !chosen && !restoredFromStorage;
  if (showPicker) {
    return <ModePickerScreen onChosen={() => setChosen(true)} />;
  }

  return mode === "admin" ? <AdminStack /> : <UserStack />;
}
