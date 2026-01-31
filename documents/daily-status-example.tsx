// Example component structure for Daily Status Display
// This is just a planning example - not integrated yet

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";

// Types
type MealStatus = "ok" | "not ok" | "pending";
type MedStatus = "ok" | "not ok" | "pending";

type DailyStatus = {
  date: string; // "2026-01-24"
  meals: {
    breakfast: MealStatus;
    lunch: MealStatus;
    dinner: MealStatus;
    supper: MealStatus;
  };
  meds: {
    morning: MedStatus;
    noon: MedStatus;
    evening: MedStatus;
    night: MedStatus;
  };
  location: {
    stayedInArea: boolean;
    breaches?: number;
  };
};

// Example component
export function DailyStatusDisplay({ statuses }: { statuses: DailyStatus[] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("fi-FI", { day: "numeric", month: "short" });
  };

  const renderStatusSymbol = (status: string) => {
    if (status === "ok") return "✓";
    if (status === "not ok") return "✗";
    return "○";
  };

  const renderMealsStatus = (meals: DailyStatus["meals"]) => {
    return [
      renderStatusSymbol(meals.breakfast),
      renderStatusSymbol(meals.lunch),
      renderStatusSymbol(meals.dinner),
      renderStatusSymbol(meals.supper),
    ].join(" ");
  };

  const renderMedsStatus = (meds: DailyStatus["meds"]) => {
    return [
      renderStatusSymbol(meds.morning),
      renderStatusSymbol(meds.noon),
      renderStatusSymbol(meds.evening),
      renderStatusSymbol(meds.night),
    ].join(" ");
  };

  return (
    <View style={styles.container}>
      {statuses.map((status) => (
        <Card key={status.date} style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.dateHeader}>
              {formatDate(status.date)}
            </Text>
            
            <View style={styles.statusRow}>
              <Text variant="bodyMedium" style={styles.label}>Food:</Text>
              <Text variant="bodyMedium" style={styles.status}>
                {renderMealsStatus(status.meals)}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text variant="bodyMedium" style={styles.label}>Meds:</Text>
              <Text variant="bodyMedium" style={styles.status}>
                {renderMedsStatus(status.meds)}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text variant="bodyMedium" style={styles.label}>Location:</Text>
              <Text variant="bodyMedium" style={styles.status}>
                {status.location.stayedInArea ? "✓ Stayed in area" : "✗ Left area"}
                {status.location.breaches && status.location.breaches > 0 && (
                  <Text style={styles.breachCount}> ({status.location.breaches} breaches)</Text>
                )}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

// Alternative: Even simpler text-based format
export function SimpleDailyStatusDisplay({ statuses }: { statuses: DailyStatus[] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    return date.toLocaleDateString("fi-FI", { day: "numeric", month: "short" });
  };

  return (
    <View style={styles.simpleContainer}>
      {statuses.map((status) => {
        const mealsStr = [
          status.meals.breakfast,
          status.meals.lunch,
          status.meals.dinner,
          status.meals.supper,
        ]
          .map((s) => (s === "ok" ? "✓" : s === "not ok" ? "✗" : "○"))
          .join("");

        const medsStr = [
          status.meds.morning,
          status.meds.noon,
          status.meds.evening,
          status.meds.night,
        ]
          .map((s) => (s === "ok" ? "✓" : s === "not ok" ? "✗" : "○"))
          .join("");

        const locationStr = status.location.stayedInArea ? "✓" : "✗";

        return (
          <Text key={status.date} variant="bodyMedium" style={styles.simpleRow}>
            {formatDate(status.date)}: Food: {mealsStr}  Meds: {medsStr}  Area: {locationStr}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    marginBottom: 8,
  },
  dateHeader: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "center",
  },
  label: {
    width: 80,
    fontWeight: "500",
  },
  status: {
    flex: 1,
  },
  breachCount: {
    color: "red",
    fontSize: 12,
  },
  simpleContainer: {
    gap: 8,
  },
  simpleRow: {
    fontFamily: "monospace",
  },
});

// Example usage with mock data:
const mockStatuses: DailyStatus[] = [
  {
    date: "2026-01-24",
    meals: { breakfast: "ok", lunch: "ok", dinner: "ok", supper: "pending" },
    meds: { morning: "ok", noon: "ok", evening: "not ok", night: "pending" },
    location: { stayedInArea: true, breaches: 0 },
  },
  {
    date: "2026-01-23",
    meals: { breakfast: "ok", lunch: "ok", dinner: "ok", supper: "not ok" },
    meds: { morning: "ok", noon: "not ok", evening: "ok", night: "ok" },
    location: { stayedInArea: true, breaches: 0 },
  },
];

// <DailyStatusDisplay statuses={mockStatuses} />
// or
// <SimpleDailyStatusDisplay statuses={mockStatuses} />
