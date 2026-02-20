import { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../app/navigation/auth/AuthNavigator";
import { resetPassword } from "../state/authActions";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { FlatInputField } from "../../../shared/components/Fields/FlatInputField";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";
import { useAppTheme } from "../../../shared/theme/theme";

export default function ResetPassword() {
    const theme = useAppTheme();
    const { spacing, width, colors } = theme;
    const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    function canSubmit() {
        return email.trim() !== "";
    }

    const handleSend = async () => {
        await resetPassword({ email });
        setSent(true);
    };

    return (
        <ScreenWrapper>
            <View style={{ flex: 1, justifyContent: "center", padding: spacing.large }}>
                <View style={{ width: width.full, padding: spacing.small, marginTop: spacing.extraLarge }}>
                    <HeaderText centered marginBottom="extraLarge">
                        Reset password
                    </HeaderText>

                    <BodyText marginBottom="medium">
                        Enter your email and we will send a reset link
                    </BodyText>

                    <FlatInputField
                        label="Email address"
                        placeholder="hello@example.fi"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <View style={{ height: spacing.extraLarge }} />

                    <PrimaryButton
                        disabled={!canSubmit()}
                        buttonColor={colors.secondary}
                        textColor={colors.onSecondary}
                        onPress={handleSend}
                    >
                        Send reset email
                    </PrimaryButton>

                    {sent ? (
                        <BodyText marginTop="medium" variant="bodyMedium" style={{ textAlign: "center" }}>
                            Reset email sent.
                        </BodyText>
                    ) : null}

                    <View style={{ height: spacing.large }} />

                    <SecondaryButton onPress={() => nav.goBack()}>
                        Back
                    </SecondaryButton>
                </View>
            </View>
        </ScreenWrapper>
    );
}
