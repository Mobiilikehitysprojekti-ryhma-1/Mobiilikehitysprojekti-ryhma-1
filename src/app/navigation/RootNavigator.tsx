import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginStack from "./LoginStack";
import UserStack from "./UserStack";
import AdminStack from "./AdminStack";

export type RootStackParamList = {
  Auth: undefined;
  UserApp: undefined;
  AdminApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
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