import { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";
import { login } from "../state/authActions";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { useAppTheme } from "../../../shared/theme/theme";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";

export default function LoginScreen() {
    const theme = useAppTheme();
    const { spacing, width, colors } = theme;
    const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function checkLoginInputs() {
        return email.trim() !== "" && password.trim() !== "";
    }

    return (
        <ScreenWrapper>
            <View style={{ flex: 1, justifyContent: "center", padding: spacing.large, }}>
                <View style={{ width: width.full, padding: spacing.small, marginTop: spacing.extraLarge }}>
                    <HeaderText centered marginBottom="extraLarge">
                        Login
                    </HeaderText>
                    <FlatInputField
                        label="Email address"
                        placeholder="hello@domain.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <View style={{ height: spacing.medium }} />
                    <FlatInputField
                        label="Password"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        keyboardType="default"
                    />
                    <View style={{ height: spacing.extraLarge }} />
                    <PrimaryButton
                        disabled={!checkLoginInputs()}
                        buttonColor={colors.secondary}
                        textColor={colors.onSecondary}
                        onPress={() => login({ email, password })}
                    >
                        Sign in
                    </PrimaryButton>
                    <View style={{ height: spacing.medium }} />

                    <Text
                        style={{
                            textAlign: "center",
                            color: colors.onSurface,
                            textDecorationLine: "underline",
                        }}
                        onPress={() => nav.navigate("ResetPassword")}
                    >
                        Forgot Password?
                    </Text>
                </View>
            </View>

            <View
                style={{
                    width: width.full,
                    alignSelf: "center",
                    marginBottom: spacing.extraLarge,
                    padding: spacing.large
                }}>
                <SecondaryButton
                    onPress={() => nav.navigate("Register")}>
                    Create account
                </SecondaryButton>
            </View>
        </ScreenWrapper>
    );
}
