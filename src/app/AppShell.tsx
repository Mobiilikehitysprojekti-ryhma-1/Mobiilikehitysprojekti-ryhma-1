import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from '../shared/types/Navigation';
import { Theme } from "../shared/theme/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Registration from "../features/screens/Registration";
import LoginScreen from "../features/screens/LoginScreen";
import ResetPasswordScreen from "../features/screens/ResetPasswordScreen";



const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppShell() {
  return (
    <PaperProvider theme={Theme}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Registration' component={Registration} options={{ 
            title: 'Create Account', 
            headerStyle: { backgroundColor: Theme.colors.primary }, 
            headerTintColor: Theme.colors.onPrimary 
        }} />
            
        <Stack.Screen name="Login" component={LoginScreen} options={{ 
            title: '', 
            headerStyle: { backgroundColor: Theme.colors.primary},
            headerShadowVisible: false,
            headerShown: false
        }} />

        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ 
            title: 'Reset account credentials', 
            headerTintColor: Theme.colors.onPrimary,
            headerStyle: { backgroundColor: Theme.colors.primary},
            headerShadowVisible: false,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}
