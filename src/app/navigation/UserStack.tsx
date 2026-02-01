import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserStackParamList } from "../../shared/types/Navigation";
import UserHomeScreen from "../../features/screens/UserHomeScreen";
import { Theme } from "../../shared/theme/colors";

const Stack = createNativeStackNavigator<UserStackParamList>()

export default function UserStack() {
    return (
        <Stack.Navigator initialRouteName='UserHome'>
            <Stack.Screen name='UserHome' component={UserHomeScreen} options={{
                title: 'User Home',
                headerStyle: { backgroundColor: Theme.colors.primary },
                headerTintColor: Theme.colors.onPrimary,
                headerShown: false
            }} />
        </Stack.Navigator>
    );
}