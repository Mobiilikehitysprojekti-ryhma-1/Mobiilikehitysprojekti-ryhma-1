import { View } from "react-native";
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
    <View style={{ flex: 1, padding: 24, backgroundColor: theme.colors.primaryContainer, justifyContent: 'space-between' }}>

      <View style={{ width: "100%", maxWidth: 400, alignSelf: 'center', marginTop: 28 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", }}>
          <PrimaryButton 
            mode="contained" 
            style={{ flex: 1, marginRight: 8 }}
          >
            User
          </PrimaryButton>

          <PrimaryButton 
            mode="contained" 
            style={{ flex: 1, marginLeft: 8 }}
          >
            Admin
          </PrimaryButton>
        </View>

        {/* Login form */}
        <View style={{ width: '100%', position: 'absolute', maxWidth: 400, marginTop: 250 }}>
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
              Login
            </PrimaryButton>

        </View>
      </View>


      <View style={{ width: "100%", maxWidth: 400, alignSelf: 'center', marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
          <PrimaryButton onPress={() => navigation.navigate("Registration")}>
            Create an account
          </PrimaryButton>
          
          <PrimaryButton onPress={() => navigation.navigate("Registration")}>
            Reset Password
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}