import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAppMode } from "../../shared/context/appModeContext";
import AppNavigator from "./app/AppNavigator";
import { AdminStack } from "./AdminStack";
import ModePickerScreen from "./ModePickerScreen";

/**
 * After login: shows a picker (User / Admin). Once chosen, shows either
 * User stack (Home) or Admin stack. Choice is remembered for next session.
 */
export default function ModeNavigator() {
  const { mode, ready } = useAppMode();
  const [chosen, setChosen] = useState(false);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!chosen) {
    return <ModePickerScreen onChosen={() => setChosen(true)} />;
  }

  return mode === "admin" ? <AdminStack /> : <AppNavigator />;
}
