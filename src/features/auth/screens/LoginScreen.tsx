import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";
import { login } from "../state/authActions";

export default function LoginScreen() {
    const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
            <Text variant="headlineMedium">Kirjaudu</Text>

            <TextInput
                label="Sähköposti"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                label="Salasana"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button mode="contained" onPress={() => login({ email, password })}>
                Kirjaudu
            </Button>

            <Button mode="text" onPress={() => nav.navigate("Register")}>
                Luo tili
            </Button>
        </View>
    );
}
