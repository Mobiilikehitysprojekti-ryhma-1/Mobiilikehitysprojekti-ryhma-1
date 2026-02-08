import React from "react";
import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AdminHomeStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useDailyStatus } from "../state/dailyStatusStore";
import { DailyStatusDisplay } from "../components/DailyStatusDisplay";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";

type Props = NativeStackScreenProps<AdminHomeStackParamList, "AdminHomeMain">;

export function AdminHomeScreen({ }: Props) {
  const theme = useTheme();
  const { spacing, width, height } = useAppTheme();
  const { user } = useAuth();
  const { mode } = useAppMode();
  const oletustilaLabel = mode === "admin" ? "Admin" : "Käyttäjä";

  // State layer - handles all business logic and data access
  const dailyStatus = useDailyStatus(user?.uid, 2); // Load last 2 days (today + yesterday)

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: spacing.large, }}>
        <BodyText>
          No user found
        </BodyText>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, top: spacing.extraLarge, padding: spacing.large, marginTop: spacing.extraLarge }}>

        {/* Daily Status Display */}
        <HeaderText marginTop="large" marginBottom="small">
          Daily Status
        </HeaderText>

        {dailyStatus.error && (
          <BodyText marginBottom="small" style={{ color: theme.colors.error }}>
            Error: {dailyStatus.error}
          </BodyText>
        )}
        <DailyStatusDisplay
          statuses={dailyStatus.statuses}
          loading={dailyStatus.loading}
        />
      </View>
    </ScreenWrapper>
  );
}
