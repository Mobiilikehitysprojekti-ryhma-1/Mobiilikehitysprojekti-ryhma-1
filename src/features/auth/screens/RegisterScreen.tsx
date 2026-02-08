import { useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";
import { register } from "../state/authActions";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";
import { BodyText } from '../../../shared/components/Texts/BodyText'
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { useAppTheme } from "../../../shared/theme/theme";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";

export default function RegisterScreen() {
    const theme = useTheme();
    const { spacing, width, height } = useAppTheme();
    const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function checkRegistrationInputs() {
        return email.trim() !== "" && password.trim() !== "";
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                style={{
                    flex: 1,
                    padding: 24,
                    justifyContent: "space-between",
                    backgroundColor: theme.colors.primaryContainer,
                }}>
                <View style={{ width: width.full, margin: "auto" }}>
                    <HeaderText>Registration</HeaderText>
                    <BodyText marginBottom="large">Please fill out your user info below to register.</BodyText>
                    <FlatInputField
                        label="Email address"
                        placeholder="hello@domain.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={{ marginBottom: spacing.medium, marginTop: spacing.small }}
                    />
                    <FlatInputField
                        label="Password"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        keyboardType="default"
                    />
                    <View style={{ margin: spacing.small }} />
                    <PrimaryButton
                        disabled={!checkRegistrationInputs()}
                        buttonColor={theme.colors.secondary}
                        textColor={theme.colors.onSecondary}
                        onPress={() => register({ email, password })}
                    >
                        Create account
                    </PrimaryButton>
                </View>

                <View
                    style={{
                        width: width.full,
                        alignItems: "center",
                        marginBottom: spacing.medium,
                    }}
                >
                    <View style={{ width: width.full, bottom: spacing.extraLarge }}>
                        <SecondaryButton
                            onPress={() => nav.navigate("Login")}>
                            Already have an account?
                        </SecondaryButton>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
