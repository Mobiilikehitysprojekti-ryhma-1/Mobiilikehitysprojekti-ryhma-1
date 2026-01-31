import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthSession } from "../../features/auth/state/authSession";
import { AppModeProvider, useAppMode } from "../../shared/context/appModeContext";
import AuthNavigator from "./auth/AuthNavigator";
import ModeNavigator from "./ModeNavigator";

export type RootStackParamList = {
    Pending: undefined;
    App: undefined;
};

function LoggedInAppContent() {
    const { resetKey } = useAppMode();
    return <ModeNavigator key={resetKey} />;
}

function LoggedInApp() {
    return (
        <AppModeProvider>
            <LoggedInAppContent />
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
