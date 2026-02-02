import { useState } from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";
import { register } from "../state/authActions";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";
import { InputField } from "../../../shared/components/Fields/InputField";

export default function RegisterScreen() {
    const theme = useTheme();
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
                }}
            >
                <View style={{ width: "100%", maxWidth: 400 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            marginBottom: 18,
                            alignSelf: "center",
                            color: theme.colors.onPrimary,
                        }}
                    >
                        Rekisteröidy
                    </Text>
                    <InputField
                        label="Sähköposti"
                        placeholder="hello@domain.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <InputField
                        label="Salasana"
                        placeholder="Salasana"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        keyboardType="default"
                    />
                    <View style={{ height: 32 }} />
                    <PrimaryButton
                        disabled={!checkRegistrationInputs()}
                        buttonColor={theme.colors.secondary}
                        textColor={theme.colors.onSecondary}
                        onPress={() => register({ email, password })}
                    >
                        Luo tili
                    </PrimaryButton>
                </View>

                <View
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        alignItems: "center",
                        marginBottom: 66,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            marginBottom: 18,
                            textAlign: "center",
                            color: theme.colors.onPrimary,
                        }}
                    >
                        Onko sinulla jo tili?
                    </Text>
                    <View style={{ width: "100%" }}>
                        <SecondaryButton
                            onPress={() => nav.navigate("Login")}
                        >
                            Kirjaudu
                        </SecondaryButton>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
