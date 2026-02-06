import React, { useMemo, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { UserStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useMeasurements } from "../state/measurementsStore";
import type { BPReading } from "../data/measurementsRepository";
import type { BloodPressureResult } from "../services/bloodPressureService";

type Props = BottomTabScreenProps<UserStackParamList, "Measurements">;

type Slot = "morning" | "evening";

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function MeasurementsScreen({}: Props) {
  const { user } = useAuth();
  const date = useMemo(() => todayStr(), []);
  const {
    dailyData,
    loading,
    error,
    loadDaily,
    saveReading,
    takeAndReadBP,
  } = useMeasurements(user?.uid);

  const [takingPhoto, setTakingPhoto] = useState<Slot | null>(null);

  // Load daily data when component mounts or date changes
  useEffect(() => {
    if (user) {
      loadDaily(date);
    }
  }, [user, date, loadDaily]);

  const takeAndSave = async (slot: Slot) => {
    if (!user) return;
    
    setTakingPhoto(slot);
    try {
      console.log("[MeasurementsScreen] Starting photo capture for", slot);
      const r = await takeAndReadBP();
      if (!r) {
        console.log("[MeasurementsScreen] Photo capture canceled");
        setTakingPhoto(null);
        return;
      }

      console.log("[MeasurementsScreen] Photo analyzed successfully:", JSON.stringify(r, null, 2));

      // Varmistus käyttäjälle (AI voi erehtyä)
      Alert.alert(
        slot === "morning" ? "Aamumittaus" : "Iltamittaus",
        `SYS ${r.sys} / DIA ${r.dia}\nPulssi ${r.pulse}\n\nTallennetaanko?`,
        [
          { text: "Peruuta", style: "cancel", onPress: () => setTakingPhoto(null) },
          {
            text: "Tallenna",
            onPress: async () => {
              try {
                const reading: BPReading = {
                  sys: r.sys,
                  dia: r.dia,
                  pulse: r.pulse,
                };

                await saveReading(date, slot, reading);
              } catch (e: any) {
                console.error("[MeasurementsScreen] Error saving reading:", e?.message || String(e));
                console.error("[MeasurementsScreen] Error details:", JSON.stringify({
                  message: e?.message,
                  code: e?.code,
                  details: e?.details,
                }, null, 2));
                Alert.alert("Virhe", e?.message ?? "Tallennus epäonnistui");
              } finally {
                setTakingPhoto(null);
              }
            },
          },
        ],
      );
    } catch (e: any) {
      console.error("[MeasurementsScreen] Error in takeAndSave:", e?.message || String(e));
      console.error("[MeasurementsScreen] Error details:", JSON.stringify({
        message: e?.message,
        code: e?.code,
        details: e?.details,
      }, null, 2));
      
      // Show detailed error message
      const errorMessage = e?.message || "Jokin meni pieleen";
      const errorCode = e?.code ? ` (${e.code})` : "";
      
      Alert.alert(
        "Virhe",
        `${errorMessage}${errorCode}\n\nTarkista konsoli-lokit lisätietoja varten.`,
      );
      setTakingPhoto(null);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verenpaine {date}</Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.buttons}>
        <View style={styles.buttonRow}>
          <Button
            title={takingPhoto === "morning" ? "Luetaan..." : "Aamu: ota kuva & lue"}
            onPress={() => takeAndSave("morning")}
            disabled={takingPhoto !== null}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            title={takingPhoto === "evening" ? "Luetaan..." : "Ilta: ota kuva & lue"}
            onPress={() => takeAndSave("evening")}
            disabled={takingPhoto !== null}
          />
        </View>

        {takingPhoto !== null && <ActivityIndicator style={styles.spinner} />}
      </View>

      <View style={styles.dailyBox}>
        <Text style={styles.resultTitle}>Tämän päivän mittaukset</Text>
        <View style={styles.readingRow}>
          <Text style={styles.text}>Aamu: </Text>
          {dailyData?.morning?.reading?.sys ? (
            <>
              <Text style={styles.text}>
                {dailyData.morning.reading.sys}/{dailyData.morning.reading.dia} 
                {dailyData.morning.reading.pulse && ` (${dailyData.morning.reading.pulse})`}
              </Text>
              <Text style={styles.statusText}>
                {dailyData.morning.status === "ok" ? "✓" : dailyData.morning.status === "pending" ? "..." : "✗"}
              </Text>
            </>
          ) : (
            <Text style={styles.text}>-</Text>
          )}
        </View>
        <View style={styles.readingRow}>
          <Text style={styles.text}>Ilta: </Text>
          {dailyData?.evening?.reading?.sys ? (
            <>
              <Text style={styles.text}>
                {dailyData.evening.reading.sys}/{dailyData.evening.reading.dia}
                {dailyData.evening.reading.pulse && ` (${dailyData.evening.reading.pulse})`}
              </Text>
              <Text style={styles.statusText}>
                {dailyData.evening.status === "ok" ? "✓" : dailyData.evening.status === "pending" ? "..." : "✗"}
              </Text>
            </>
          ) : (
            <Text style={styles.text}>-</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  errorBox: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#ffebee",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  buttons: {
    gap: 12,
    marginBottom: 24,
  },
  buttonRow: {
    marginVertical: 6,
  },
  spinner: {
    marginTop: 12,
  },
  resultBox: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#e3f2fd",
  },
  dailyBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  readingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    marginLeft: 8,
  },
  small: {
    marginTop: 8,
    fontSize: 12,
    color: "#555",
  },
});
