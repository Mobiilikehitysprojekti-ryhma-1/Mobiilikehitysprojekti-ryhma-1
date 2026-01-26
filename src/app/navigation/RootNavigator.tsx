import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthSession } from "../../features/auth/state/authSession";
import AuthNavigator from "./auth/AuthNavigator";
import AppNavigator from "./app/AppNavigator";

export type RootStackParamList = {
    Auth: undefined;
    App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, unlocked } = useAuthSession();

    const showApp = Boolean(user) && unlocked;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showApp ? (
                <Stack.Screen name="App" component={AppNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
}
