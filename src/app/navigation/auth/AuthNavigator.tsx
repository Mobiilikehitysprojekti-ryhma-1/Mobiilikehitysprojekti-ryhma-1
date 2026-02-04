import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthSession } from "../../../features/auth/state/authSession";
import LoginScreen from "../../../features/auth/screens/LoginScreen";
import RegisterationScreen from "../../../features/auth/screens/RegisterationScreen";
import ResetPasswordScreen from "../../../features/auth/screens/ResetPasswordScreen";
import UnlockScreen from "../../../features/auth/screens/UnlockScreen";

export type AuthStackParamList = {
    Unlock: undefined;
    Login: undefined;
    Register: undefined;
    ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    const { user, unlocked } = useAuthSession();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user && !unlocked ? (
                <Stack.Screen name="Unlock" component={UnlockScreen} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterationScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}
