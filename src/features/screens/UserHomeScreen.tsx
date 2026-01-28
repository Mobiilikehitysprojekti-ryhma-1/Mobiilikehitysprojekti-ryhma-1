import { View, Text } from "react-native";
import { useState } from "react";
import { Icon, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserStackParamList } from "../../shared/types/Navigation";

import { PrimaryButton } from "../../shared/components/Button/PrimaryButton";
import { FlatInputField } from "../../shared/components/Fields/FlatInputField";


type UserHomeScreenProps = NativeStackScreenProps<
    UserStackParamList,
    "UserHome"
>;

export default function UserHomeScreen({ navigation }: UserHomeScreenProps) {
    const theme = useTheme();
    const [AtHome, setAtHome] = useState(true);

    return (
        <View style={{ flex: 1, paddingTop: 24, backgroundColor: theme.colors.primaryContainer, justifyContent: 'space-between' }}>

            <View style={{ width: "100%", maxWidth: 500, alignSelf: 'center' }}>

                {/* Login form */}
                <View style={{ width: '100%', position: 'absolute', marginTop: '30%', padding: 10 }}>
                    <Text style={{ fontSize: 24, marginBottom: 24, alignSelf: 'center', color: theme.colors.onPrimary }}>
                        Show stuff here
                    </Text>
                    <View style={{ width: "100%", maxWidth: 400, alignSelf: 'center', marginBottom: 54 }}>

                    </View>
                </View>
            </View>

            {/* Bottom Navigator */}
            <View style={{ width: "100%", maxWidth: 400, alignSelf: 'center', marginBottom: 54 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>

                    <PrimaryButton
                        icon={() => (<Icon source="camera" size={40} color={theme.colors.onSecondary} />)}
                        onPress={() => console.log('Pressed')}>
                        Camera
                    </PrimaryButton>

                    <PrimaryButton icon={() => (
                        <Icon
                            source={AtHome ? "account-arrow-right-outline" : "account-arrow-left-outline"}
                            size={40}
                            color={theme.colors.onSecondary} />
                    )}
                        onPress={() => {
                            if (AtHome) {
                                setAtHome(false);
                                console.log("User logged out");
                            }
                            else {
                                setAtHome(true);
                                console.log("User logged in");
                            }
                        }}>
                        {AtHome ? "Check out" : "Check in"}
                    </PrimaryButton>
                </View>
            </View>
        </View>
    );
}