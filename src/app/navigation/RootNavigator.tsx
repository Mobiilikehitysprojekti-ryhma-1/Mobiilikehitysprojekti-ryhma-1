<<<<<<< HEAD
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthSession } from "../../features/auth/state/authSession";
import AuthNavigator from "./auth/AuthNavigator";
import AppNavigator from "./app/AppNavigator";

export type RootStackParamList = {
    Auth: undefined;
    App: undefined;
=======
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginStack from "./LoginStack";
import UserStack from "./UserStack";
import AdminStack from "./AdminStack";

export type RootStackParamList = {
  Auth: undefined;
  UserApp: undefined;
  AdminApp: undefined;
>>>>>>> ui-navigation
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
<<<<<<< HEAD
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
=======
  // --- AUTH PLACEHOLDERS ---
  // These should come from auth
  const [user, setUser] = useState<{ role: 'user' | 'admin' } | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const showApp = Boolean(user) && unlocked;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!showApp ? (
        // if not logged in -> Show Login, Registration, etc.
        <Stack.Screen name="Auth">
          {(props) => (
            <LoginStack
              {...props}
              onUserLogin={() => {
                setUser({ role: 'user' });
                setUnlocked(true);
              }}
              onAdminLogin={() => {
                setUser({ role: 'admin' });
                setUnlocked(true);
              }}
            />
          )}
        </Stack.Screen>
      ) : user?.role === 'admin' ? (
        // Logged in as Admin
        <Stack.Screen name="AdminApp" component={AdminStack} />
      ) : (
        // Logged in as regular User
        <Stack.Screen name="UserApp" component={UserStack} />
      )}
    </Stack.Navigator>
  );
}
>>>>>>> ui-navigation
