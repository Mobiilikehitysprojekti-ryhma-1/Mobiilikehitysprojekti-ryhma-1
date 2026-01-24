import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/Navigation";
import { useState } from "react";

import { PrimaryButton } from "../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../shared/components/Button/SecondaryButton";
import { InputField } from "../../shared/components/Fields/InputField";
import { useTheme } from "react-native-paper";



type RegistrationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Registration"
>;

export default function RegistrationScreen({ navigation }: RegistrationScreenProps) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function checkRegistrationInputs() {

    return email.trim() !== "" && username.trim() !== "" && password.trim() !== "";
    
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
      <View style={{ width: "100%", maxWidth: 400 }}>
        <Text style={{ fontSize: 24, marginBottom: 24 }}>
          Login
        </Text>

        <InputField
          label="Email"
          placeholder="hello@domain.com"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />

        <InputField
          label="Username"
          placeholder="Enter your username"
          onChangeText={setUsername}
          value={username}
          keyboardType="default"
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          keyboardType="default"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <View style={{ height: 32 }} />
      
        <PrimaryButton disabled={!checkRegistrationInputs()}
          onPress={() =>
            navigation.navigate("Login")}>
          Register
        </PrimaryButton>
      </View>

      <View style={{ width: "100%", maxWidth: 400, alignItems: 'center', marginBottom: 66 }}>
        <Text style={{ fontSize: 24, marginBottom: 18, textAlign: 'center' }}>
          Already have an account?
        </Text>
        <View style={{ width: "100%" }}>
        <SecondaryButton onPress={() => 
            navigation.navigate("Login")}>
          Login
        </SecondaryButton>
        </View>
      </View>
    </View>
  );
}
