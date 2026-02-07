import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthSession } from "../../features/auth/state/authSession";
import AuthNavigator from "./auth/AuthNavigator";
import AppNavigator from "./app/AppNavigator";
import DeviceModeScreen from "../../features/auth/screens/DeviceModeScreen";

export type RootStackParamList = {
  Auth: undefined;
  DeviceMode: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, unlocked, deviceMode } = useAuthSession();
  const showDeviceMode = Boolean(user) && unlocked && !deviceMode;
  const showApp = Boolean(user) && unlocked && Boolean(deviceMode);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showApp ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : showDeviceMode ? (
        <Stack.Screen name="DeviceMode" component={DeviceModeScreen} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
