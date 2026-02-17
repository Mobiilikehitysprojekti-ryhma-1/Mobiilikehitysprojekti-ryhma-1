import React, { useMemo, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { UserStackParamList } from "../navigation/types";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useMeasurements } from "../state/measurementsStore";
import type { BPReading } from "../data/measurementsRepository";
import type { BloodPressureResult } from "../services/bloodPressureService";

import { BodyText } from "../../../shared/components/Texts/BodyText";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { PrimaryButton } from "../../../shared/components/Button/PrimaryButton";
import { useAppTheme } from "../../../shared/theme/theme";
import { useTheme } from "react-native-paper";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";

type Props = BottomTabScreenProps<UserStackParamList, "Measurements">;

type Slot = "morning" | "evening";

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function MeasurementsScreen({ }: Props) {
  const theme = useTheme();
  const { spacing, width } = useAppTheme();
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

  if (takingPhoto) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.primary,
        padding: spacing.large,
      }}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
        <BodyText style={{
          marginTop: spacing.large,
          textAlign: "center",
          marginHorizontal: spacing.large,
          fontSize: 16,
        }}>
          Reading measurement...
        </BodyText>
      </View>
    );
  }


  return (
    <ScreenWrapper>
      <View style={{ top: spacing.extraLarge, padding: spacing.large }}>
        <HeaderText marginBottom="extraLarge">Verenpaine {date}</HeaderText>

        {error && (
          <View style={{
            marginBottom: spacing.large,
            padding: spacing.medium,
            backgroundColor: theme.colors.error
          }}>
            <BodyText>{error}</BodyText>
          </View>
        )}

        <View>
          <PrimaryButton
            onPress={() => takeAndSave("morning")}
            disabled={takingPhoto !== null}
            style={{ marginBottom: spacing.medium }}>
            {takingPhoto === "morning" ? "Luetaan..." : "Aamu: ota kuva mittarista"}
          </PrimaryButton>

          <PrimaryButton
            onPress={() => takeAndSave("evening")}
            disabled={takingPhoto !== null}>
            {takingPhoto === "evening" ? "Luetaan..." : "Ilta: ota kuva mittarista"}
          </PrimaryButton>
        </View>




        <View style={{ padding: spacing.large, backgroundColor: theme.colors.secondary, marginTop: spacing.large }}>
          <HeaderText marginBottom="large">Todays measurements</HeaderText>
          <View>
            <BodyText>Morning: </BodyText>
            {dailyData?.morning?.reading?.sys ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.small }}>
                <BodyText >
                  {dailyData.morning.reading.sys}/{dailyData.morning.reading.dia}
                  {dailyData.morning.reading.pulse && ` (${dailyData.morning.reading.pulse})`}
                </BodyText>
                <BodyText style={{ marginLeft: spacing.small}}>
                  {dailyData.morning.status === "ok" ? " ✓" : dailyData.morning.status === "pending" ? "..." : " ✗"}
                </BodyText>
              </View>
            ) : (
              <BodyText>-</BodyText>
            )}
          </View>
          <View>
            <BodyText>Evening: </BodyText>
            {dailyData?.evening?.reading?.sys ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BodyText>
                  {dailyData.evening.reading.sys}/{dailyData.evening.reading.dia}
                  {dailyData.evening.reading.pulse && ` (${dailyData.evening.reading.pulse})`}
                </BodyText>

                <BodyText style={{ marginLeft: spacing.small}}>
                  {dailyData.evening.status === "ok" ? " ✓" : dailyData.evening.status === "pending" ? "..." : " ✗"}
                </BodyText>
              </View>
            ) : (
              <BodyText>-</BodyText>
            )}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}