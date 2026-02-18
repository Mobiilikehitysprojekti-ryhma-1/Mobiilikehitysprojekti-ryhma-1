import React from "react";
import { useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAppTheme } from "../../../shared/theme/theme";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";
import { changePassword, resetPassword } from "../../auth/state/authActions";

export function PasswordManagement() {
    const theme = useTheme();
    const { spacing } = useAppTheme();
    const navigation = useNavigation();
    const { user } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const [email, setEmail] = useState("");

    const [changing, setChanging] = useState(false);
    const [resetting, setResetting] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) return;
        if (newPassword !== newPasswordConfirm) return;

        setChanging(true);
        try {
            await changePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");

            navigation.goBack();
        } finally {
            setChanging(false);
        }
    };

    if (!user) {
        return (
            <ScreenWrapper>
                <View style={{ top: spacing.extraLarge, padding: spacing.large }}>
                    <HeaderText marginBottom="extraLarge">Password</HeaderText>
                    <BodyText variant="bodyMedium">No user found</BodyText>
                </View>
            </ScreenWrapper>
        );
    }

    const canSubmitChange =
        !!currentPassword &&
        !!newPassword &&
        newPassword === newPasswordConfirm &&
        !changing;

    return (
        <ScreenWrapper>
            <View style={{ top: spacing.extraLarge, padding: spacing.large }}>

                <BodyText marginBottom="medium">
                    Change password
                </BodyText>

                <BodyText>Current password</BodyText>
                <FlatInputField
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current password"
                    secureTextEntry
                    autoCapitalize="none"
                    style={{ marginBottom: spacing.medium }}
                />

                <BodyText>New password</BodyText>
                <FlatInputField
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New password"
                    secureTextEntry
                    autoCapitalize="none"
                    style={{ marginBottom: spacing.medium }}
                />

                <BodyText>Confirm new password</BodyText>
                <FlatInputField
                    value={newPasswordConfirm}
                    onChangeText={setNewPasswordConfirm}
                    placeholder="Confirm new password"
                    secureTextEntry
                    autoCapitalize="none"
                    style={{ marginBottom: spacing.medium }}
                />

                <PrimaryButton
                    style={{ marginBottom: spacing.extraLarge }}
                    onPress={handleChangePassword}
                    disabled={!canSubmitChange}
                    loading={changing}
                >
                    {changing ? "Changing..." : "Change password"}
                </PrimaryButton>

                <View
                    style={{
                        height: 1,
                        backgroundColor: theme.colors.outlineVariant,
                        marginBottom: spacing.extraLarge,
                    }}
                />

                <SecondaryButton onPress={() => navigation.goBack()}>
                    Back
                </SecondaryButton>
            </View>
        </ScreenWrapper>
    );
}