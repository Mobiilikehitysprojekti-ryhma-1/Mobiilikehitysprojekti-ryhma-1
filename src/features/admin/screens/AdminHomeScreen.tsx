import React from "react";
import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AdminHomeStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAppMode } from "../../../shared/context/appModeContext";
import { useDailyStatus } from "../state/dailyStatusStore";
import { DailyStatusDisplay } from "../components/DailyStatusDisplay";

type Props = NativeStackScreenProps<AdminHomeStackParamList, "AdminHomeMain">;

export function AdminHomeScreen({}: Props) {
	const theme = useTheme();
	const { user } = useAuth();
	const { mode } = useAppMode();
	const oletustilaLabel = mode === "admin" ? "Admin" : "Käyttäjä";

	// State layer - handles all business logic and data access
	const dailyStatus = useDailyStatus(user?.uid, 2); // Load last 2 days (today + yesterday)

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 12,
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Text style={{ color: theme.colors.onPrimary }} variant="bodyMedium">
          No user found
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 24,
        padding: 16,
        gap: 12,
        backgroundColor: theme.colors.primaryContainer,
      }}
    >
      <Text
        style={{ color: theme.colors.onPrimary }}
        variant="bodyMedium"
      >
        ADMIN home screen
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          color: theme.colors.onPrimary,
          opacity: 0.9,
        }}
        variant="bodySmall"
      >
        User ID: {user.uid}
      </Text>
      <Text
        style={{ color: theme.colors.onPrimary, opacity: 0.9 }}
        variant="bodySmall"
      >
        Nykyinen oletustila: {oletustilaLabel}
      </Text>

      {/* Daily Status Display */}
      <Text
        style={{ marginTop: 16, marginBottom: 8, color: theme.colors.onPrimary }}
        variant="titleMedium"
      >
        Daily Status
      </Text>
      {dailyStatus.error && (
        <Text
          style={{ color: theme.colors.error, marginBottom: 8 }}
          variant="bodySmall"
        >
          Error: {dailyStatus.error}
        </Text>
      )}
      <DailyStatusDisplay
        statuses={dailyStatus.statuses}
        loading={dailyStatus.loading}
      />
    </View>
  );
}
