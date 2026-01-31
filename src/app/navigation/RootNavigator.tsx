import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthSession } from "../../features/auth/state/authSession";
import { AppModeProvider } from "../../shared/context/appModeContext";
import AuthNavigator from "./auth/AuthNavigator";
import ModeNavigator from "./ModeNavigator";

export type RootStackParamList = {
    Pending: undefined;
    App: undefined;
};

function LoggedInApp() {
    return (
        <AppModeProvider>
            <ModeNavigator />
        </AppModeProvider>
    );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, unlocked } = useAuthSession();

    const showApp = Boolean(user) && unlocked;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showApp ? (
                <Stack.Screen name="App" component={LoggedInApp} />
            ) : (
                <Stack.Screen name="Pending" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
}
