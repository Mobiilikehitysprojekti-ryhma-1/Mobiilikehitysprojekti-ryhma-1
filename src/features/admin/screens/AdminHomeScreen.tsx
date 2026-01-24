import React from "react";
import { View, ActivityIndicator } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useMeals } from "../state/mealsStore";
import { useMeds } from "../state/medsStore";
import { useLocation } from "../state/locationStore";
import { useAdminHome } from "../state/adminHomeStore";
import { useDailyStatus } from "../state/dailyStatusStore";
import { DailyStatusDisplay } from "../components/DailyStatusDisplay";

type Props = BottomTabScreenProps<AdminStackParamList, "AdminHome">;

export function AdminHomeScreen({}: Props) {
	const { user, loading: authLoading, error: authError } = useAuth();
	
	// State layer - handles all business logic and data access
	const adminHome = useAdminHome(user?.uid);
	const meals = useMeals(user?.uid);
	const meds = useMeds(user?.uid);
	const location = useLocation(user?.uid);
	const dailyStatus = useDailyStatus(user?.uid, 2); // Load last 2 days (today + yesterday)

  // Test function - uses state layer instead of direct repository calls
  const runTest = async () => {
    if (!user) return;

    try {
      // 1) setMeals via state layer
      await meals.saveMeals({
        breakfast: { label: "Aamupala", time: "08:00" },
        lunch: { label: "Lounas", time: "12:00" },
        dinner: { label: "Päivällinen", time: "17:00" },
        supper: { label: "Iltapala", time: "20:00" },
      });

      // 2) getMeals via state layer
      await meals.loadMeals();
      console.log("MEALS:", meals.meals);

      // 3) setMeds via state layer
      await meds.saveMeds({
        morning: { label: "Aamulääke", time: "08:30" },
        noon: { label: "Päivälääke", time: "12:30" },
        evening: { label: "Iltalääke", time: "18:30" },
        night: { label: "Yölääke", time: "22:00" },
      });

      // 4) getMeds via state layer
      await meds.loadMeds();
      console.log("MEDS:", meds.meds);

      // 5) setLocation via state layer
      await location.saveLocation({
        enabled: true,
        home: { lat: 60.1699, lng: 24.9384, radiusMeters: 150 },
      });

      // 6) getLocation via state layer
      await location.loadLocation();
      console.log("LOCATION:", location.location);

      // 7) Create sample daily status for today and yesterday
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todayStr = today.toISOString().split("T")[0];
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      console.log("Creating daily status for:", todayStr, "and", yesterdayStr);

      // Today's status (some pending items)
      try {
        await dailyStatus.saveDailyStatus({
          date: todayStr,
          meals: {
            breakfast: "ok",
            lunch: "ok",
            dinner: "pending",
            supper: "pending",
          },
          meds: {
            morning: "ok",
            noon: "ok",
            evening: "pending",
            night: "pending",
          },
          location: {
            stayedInArea: true,
            breaches: 0,
          },
        });
        console.log("Today's status saved successfully");
      } catch (err: any) {
        console.error("Error saving today's status:", err);
        console.error("Error details:", err.message, err.code);
      }

      // Yesterday's status (all completed)
      try {
        await dailyStatus.saveDailyStatus({
          date: yesterdayStr,
          meals: {
            breakfast: "ok",
            lunch: "ok",
            dinner: "ok",
            supper: "not ok",
          },
          meds: {
            morning: "ok",
            noon: "not ok",
            evening: "ok",
            night: "ok",
          },
          location: {
            stayedInArea: true,
            breaches: 0,
          },
        });
        console.log("Yesterday's status saved successfully");
      } catch (err: any) {
        console.error("Error saving yesterday's status:", err);
        console.error("Error details:", err.message, err.code);
      }

      // 8) Reload daily status to see the new data
      await dailyStatus.loadDailyStatus();
      console.log("DAILY STATUS:", dailyStatus.statuses);
      if (dailyStatus.error) {
        console.error("Daily status error:", dailyStatus.error);
      }
    } catch (error) {
      console.error("Test error:", error);
    }
  };

  if (authLoading) {
    return (
      <View style={{ padding: 16, gap: 12, alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium">Signing in anonymously...</Text>
      </View>
    );
  }

  if (authError) {
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Text variant="headlineSmall" style={{ color: "red" }}>Authentication Error</Text>
        <Text variant="bodyMedium">{authError}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Text variant="bodyMedium">No user found</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text variant="bodyMedium">Admin home screen</Text>
      <Text variant="bodySmall" style={{ fontWeight: "bold", color: "red" }}>User ID: {user.uid}</Text>
      <Text variant="bodySmall" style={{ fontWeight: "bold", color: "red" }}>Anonymous: {user.isAnonymous ? "Yes" : "No"}</Text>
      
      {/* Daily Status Display */}
      <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>Daily Status</Text>
      {dailyStatus.error && (
        <Text variant="bodySmall" style={{ color: "red", marginBottom: 8 }}>
          Error: {dailyStatus.error}
        </Text>
      )}
      <DailyStatusDisplay 
        statuses={dailyStatus.statuses} 
        loading={dailyStatus.loading}
      />
      
      <Button 
        mode="contained" 
        onPress={adminHome.checkConnection}
        disabled={adminHome.isChecking}
      >
        {adminHome.isChecking ? "Checking..." : "Check Firebase Connection"}
      </Button>
      
      {adminHome.connectionStatus ? (
        <Text variant="bodyMedium" style={{ marginTop: 8 }}>
          {adminHome.connectionStatus}
        </Text>
      ) : null}

      <Button mode="contained" onPress={runTest} disabled={!user}>
        Testaa Firestore get/set testidatalla
      </Button>
    </View>
  );
}
