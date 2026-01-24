import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AdminStack } from "./navigation/AdminStack";

export default function AppShell() {

//Tämä on käyttöliittymän kannalta ylimääräinen, mutta pitää olla jossain kohtaa.
/*
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [user, setUser] = useState<User | null>(null);
*/
// TODO: Käyttäjän rooli tulee tästä.

//if user is admin, show AdminStack, else show UserStack jotain tälläistä.

  return (
    <NavigationContainer>
      <AdminStack /> 
    </NavigationContainer>
  );
}
