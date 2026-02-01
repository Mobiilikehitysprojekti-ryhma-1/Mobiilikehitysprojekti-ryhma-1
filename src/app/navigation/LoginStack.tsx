import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackParamList } from "../../shared/types/Navigation";

import Registration from "../../features/screens/Registration";
import LoginScreen from "../../features/screens/LoginScreen";
import ResetPasswordScreen from "../../features/screens/ResetPasswordScreen";
import AdminLoginScreen from "../../features/screens/AdminLoginScreen";
import { Theme } from "../../shared/theme/colors";

const Stack = createNativeStackNavigator<LoginStackParamList>();

interface LoginStackProps {
    onUserLogin: () => void;
    onAdminLogin: () => void;
}

export default function LoginStack({ onUserLogin, onAdminLogin }: LoginStackProps) {
    return (
        <Stack.Navigator initialRouteName='Login'>
            {/* User Login */}
            <Stack.Screen name="Login" options={{
                title: '',
                headerStyle: { backgroundColor: Theme.colors.primary },
                headerShadowVisible: false,
                headerShown: false
            }}>
                {(props) => <LoginScreen {...props} onUserLogin={onUserLogin} />}
            </Stack.Screen>

            {/* Admin Login */}
            <Stack.Screen name="AdminLogin" options={{
                title: 'Back to User Login',
                headerStyle: { backgroundColor: Theme.colors.primary },
                headerShadowVisible: false,
                headerShown: true,
                headerTintColor: Theme.colors.onPrimary
            }}>
                {(props) => <AdminLoginScreen {...props} onAdminLogin={onAdminLogin} />}
            </Stack.Screen>

            <Stack.Screen name='Registration' component={Registration} options={{
                title: 'Create Account',
                headerStyle: { backgroundColor: Theme.colors.primary },
                headerTintColor: Theme.colors.onPrimary
            }} />

            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{
                title: 'Reset account credentials',
                headerTintColor: Theme.colors.onPrimary,
                headerStyle: { backgroundColor: Theme.colors.primary },
                headerShadowVisible: false
            }} />
        </Stack.Navigator>
    );
}