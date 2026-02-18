import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../../features/auth/screens/LoginScreen";
import RegisterScreen from "../../../features/auth/screens/RegisterScreen";
import ResetPassword from "../../../features/auth/screens/ResetPassword";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
    );
}
