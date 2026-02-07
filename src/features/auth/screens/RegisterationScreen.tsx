import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useMemo, useState } from "react";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";
import { InputField } from "../../../shared/components/Fields/InputField";

import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";
import { register } from "../state/authActions";

export default function RegistrationScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 &&
      username.trim().length > 0 &&
      password.trim().length > 0 &&
      !submitting
    );
  }, [email, username, password, submitting]);

  async function handleRegister() {
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      await register({
        email: email.trim(),
        password,
        username: username.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, padding: 24, justifyContent: "space-between" }}>
        <View style={{ width: "100%", maxWidth: 400 }}>
          <InputField label="Email" placeholder="hello@domain.com" onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <InputField label="Username" placeholder="Enter your username" onChangeText={setUsername} value={username} keyboardType="default" />
          <InputField label="Password" placeholder="Enter your password" keyboardType="default" onChangeText={setPassword} value={password} secureTextEntry />

          <View style={{ height: 32 }} />

          <PrimaryButton disabled={!canSubmit} onPress={handleRegister}>
            Register
          </PrimaryButton>
        </View>

        <View style={{ width: "100%", maxWidth: 400, alignItems: "center", marginBottom: 66 }}>
          <Text style={{ fontSize: 24, marginBottom: 18, textAlign: "center" }}>
            Already have an account?
          </Text>
          <View style={{ width: "100%" }}>
            <SecondaryButton onPress={() => navigation.navigate("Login")}>
              Login
            </SecondaryButton>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}