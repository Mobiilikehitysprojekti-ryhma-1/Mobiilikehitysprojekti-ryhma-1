import { useState } from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";
import { login } from "../state/authActions";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";

export default function LoginScreen() {
    const theme = useTheme();
    const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function checkLoginInputs() {
        return email.trim() !== "" && password.trim() !== "";
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
                    <View style={{ width: "100%", padding: 10, marginTop: 80 }}>
                        <Text
                            style={{
                                fontSize: 24,
                                marginBottom: 24,
                                alignSelf: "center",
                                color: theme.colors.onPrimary,
                            }}
                        >
                            Kirjaudu
                        </Text>
                        <FlatInputField
                            label="Sähköposti"
                            placeholder="Sähköposti"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <View style={{ height: 16 }} />
                        <FlatInputField
                            label="Salasana"
                            placeholder="Salasana"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            keyboardType="default"
                        />
                        <View style={{ height: 32 }} />
                        <PrimaryButton
                            disabled={!checkLoginInputs()}
                            buttonColor={theme.colors.secondary}
                            textColor={theme.colors.onSecondary}
                            onPress={() => login({ email, password })}
                        >
                            Kirjaudu
                        </PrimaryButton>
                    </View>
                </View>

                <View
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        alignSelf: "center",
                        marginBottom: 54,
                    }}
                >
                    <PrimaryButton
                        mode="outlined"
                        onPress={() => nav.navigate("Register")}
                    >
                        Luo tili
                    </PrimaryButton>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
