import { View, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/Navigation";
import { useState } from "react";

import { PrimaryButton } from "../../shared/components/Button/PrimaryButton";
import { FlatInputField } from "../../shared/components/Fields/FlatInputField";

type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const theme = useTheme();
  const [hasBiometric, setHasBiometric] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeRole, setActiveRole] = useState<"User" | "Admin">("User");

  function checkLoginInputs() {
    return username.trim() !== "" && password.trim() !== "";
  }

  if (hasBiometric) {
    return (
      <View style={{ flex: 1, padding: 24, backgroundColor: theme.colors.background }}>
        {/* if user has biometric authentication render biometric login screen here */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 24, backgroundColor: theme.colors.primaryContainer, justifyContent: 'space-between' }}>

      <View style={{ width: "100%", maxWidth: 500, alignSelf: 'center' }}>
        
        {/* Login form */}
        <View style={{ width: '100%', position: 'absolute', marginTop: 250, padding: 10 }}>
          <Text style={{ fontSize: 24, marginBottom: 24, alignSelf: 'center', color: theme.colors.onPrimary }}>
              User Login
          </Text>
          <FlatInputField
            label="Username"
            placeholder="Enter your username"
            onChangeText={setUsername}
            value={username}
            keyboardType="default"
          />
          <View style={{ height: 16 }} />
          <FlatInputField
            label="Password"
            placeholder="Enter your password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            keyboardType="default"
          />
          <View style={{ height: 32 }} />
            <PrimaryButton 
              disabled={!checkLoginInputs()}
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.onSecondary}
              onPress={() => navigation.navigate("Registration")}>
              Login as a user
            </PrimaryButton>
          <Text style={{ alignSelf: 'center', marginTop: 16, color: theme.colors.onPrimary }}>
            or
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: "100%", marginTop: 16 }}>
            <PrimaryButton 
              style={{ flex: 1,  }}
              buttonColor={activeRole === "Admin" ? theme.colors.primary : theme.colors.secondary}
              textColor={activeRole === "Admin" ? theme.colors.onTertiary : theme.colors.onPrimary}
              onPress={() => navigation.navigate("AdminLogin")}>
              Login as admin
            </PrimaryButton>
          </View>

        </View>
      </View>


      <View style={{ width: "100%", maxWidth: 400, alignSelf: 'center', marginBottom: 54 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
          <PrimaryButton onPress={() => navigation.navigate("Registration")}>
            Create an account
          </PrimaryButton>
          
          <PrimaryButton onPress={() => navigation.navigate("ResetPassword")}>
            Reset Password
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}