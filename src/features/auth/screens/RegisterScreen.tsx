import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { register } from "../state/authActions";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
            <Text variant="headlineMedium">Rekisteröidy</Text>

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

            <Button mode="contained" onPress={() => register({ email, password })}>
                Luo tili
            </Button>
        </View>
    );
}
