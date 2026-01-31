import { View, Text } from "react-native";
import { useState } from "react";
import { Icon, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../shared/types/Navigation";

import { PrimaryButton } from "../../shared/components/Button/PrimaryButton";
import { FlatInputField } from "../../shared/components/Fields/FlatInputField";


type AdminHomeScreenProps = NativeStackScreenProps<
    AdminStackParamList,
    "AdminHome"
>;

export default function AdminHomeScreen({ navigation }: AdminHomeScreenProps) {
    const theme = useTheme();
    const [AtHome, setAtHome] = useState(true);

    return (
        <View style={{ flex: 1, paddingTop: 24, backgroundColor: theme.colors.primaryContainer, justifyContent: 'space-between' }}>

            <View style={{ width: "100%", maxWidth: 500, alignSelf: 'center' }}>
                <View style={{ width: '100%', position: 'absolute', marginTop: '30%', padding: 10 }}>
                    <Text style={{ fontSize: 24, marginBottom: 24, alignSelf: 'center', color: theme.colors.onPrimary }}>
                        Show stuff here
                    </Text>
                    <View style={{ width: "100%", maxWidth: 400, alignSelf: 'center', marginBottom: 54 }}>
                    </View>
                </View>
            </View>
        </View>
    );
}