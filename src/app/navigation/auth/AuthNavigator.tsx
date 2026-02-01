import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthSession } from "../../../features/auth/state/authSession";
import LoginScreen from "../../../features/auth/screens/LoginScreen";
import RegisterScreen from "../../../features/auth/screens/RegisterScreen";
import UnlockScreen from "../../../features/auth/screens/UnlockScreen";

export type AuthStackParamList = {
    Unlock: undefined;
    Login: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    const { user, unlocked } = useAuthSession();

    if (user && !unlocked) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Unlock" component={UnlockScreen} />
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}
