import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { login } from "../state/authActions";
import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";

import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";

export default function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !submitting;
  }, [email, password, submitting]);

  async function handleLogin() {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          paddingTop: 24,
          backgroundColor: theme.colors.primaryContainer,
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "100%", maxWidth: 500, alignSelf: "center" }}>
          <View style={{ width: "100%", position: "absolute", marginTop: 250, padding: 10 }}>
            <Text
              style={{
                fontSize: 24,
                marginBottom: 24,
                alignSelf: "center",
                color: theme.colors.onPrimary,
              }}
            >
              Login
            </Text>

            <FlatInputField
              label="Email"
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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
              disabled={!canSubmit}
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.onSecondary}
              onPress={handleLogin}
            >
              Login
            </PrimaryButton>
          </View>
        </View>

        <View style={{ width: "100%", maxWidth: 400, alignSelf: "center", marginBottom: 54 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <PrimaryButton onPress={() => navigation.navigate("Register")}>
              Create an account
            </PrimaryButton>

            <PrimaryButton onPress={() => navigation.navigate("ResetPassword")}>
              Reset Password
            </PrimaryButton>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
