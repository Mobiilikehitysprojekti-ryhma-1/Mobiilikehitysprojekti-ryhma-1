import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { BPDoc, fetchLast14BPDocs } from "../state/measurementsHistoryStore";
import { useAuth } from "../../../shared/hooks/useAuth";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

// Chart width - will be calculated inside component based on data
const screenWidth = Dimensions.get("window").width;

type Props = BottomTabScreenProps<AdminStackParamList, "MeasurementsHistory">;

export function MeasurementsHistoryScreen({}: Props) {
	const { user } = useAuth();
	const userId = user?.uid;
  const [docs, setDocs] = useState<BPDoc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const MORNING_COLOR = "rgba(37, 99, 235"; // sininen
  const EVENING_COLOR = "rgba(234, 88, 12"; // oranssi

  const loadData = useCallback(async () => {
    if (!userId) {
      setError("Käyttäjää ei löydy");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const rows = await fetchLast14BPDocs(userId);
      setDocs(rows);
    } catch (e: any) {
      setError(e?.message ?? "Tuntematon virhe");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load data when screen comes into focus (refreshes when navigating back to tab)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );


  // Chart data for morning systolic pressure
  // Create paired arrays: only include entries with valid BP readings
  const chartData = docs
	.map((d) => {
		const sys = d.bloodPressure?.morning?.reading?.sys;
		if (sys === null || sys === undefined) return null;
		
		const date = new Date(d.date);
		return {
			label: `${date.getDate()}.${date.getMonth() + 1}.`,
			value: sys,
		};
	})
	.filter((item): item is { label: string; value: number } => item !== null);

	const diaMorningData = docs.map(
		(d) => d.bloodPressure?.morning?.reading?.dia ?? null
	  )
	.filter((item): item is number => item !== null);

  const chartLabels = chartData.map((item) => item.label);

  // Morning systolic pressure data
  const sysMorningData = chartData.map((item) => item.value);

  // Evening systolic pressure data
  const sysEveningData = docs.map(
	(d) => d.bloodPressure?.evening?.reading?.sys ?? null
  )
  .filter((item): item is number => item !== null);
  
  // Evening diastolic pressure data
  const diaEveningData = docs.map(
	(d) => d.bloodPressure?.evening?.reading?.dia ?? null
  )
  .filter((item): item is number => item !== null);
  
  // Calculate chart width based on number of data points
  const chartWidth = Math.max(screenWidth - 32, chartData.length * 48);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Verenpaineiden historia (14 viimeistä)

      </Text>
	  <Text>Haettu: {docs.length} päivää</Text>

	  {docs.length > 0 && (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <LineChart
      data={{
		labels: chartLabels,
		datasets: [
			{
			  data: sysMorningData,
			  color: (o = 1) => `${MORNING_COLOR}, ${o})`,
			  strokeWidth: 2,
			},
			{
			  data: diaMorningData,
			  color: (o = 1) => `${MORNING_COLOR}, ${o})`,
			  strokeWidth: 2,
			},
			{
			  data: sysEveningData,
			  color: (o = 1) => `${EVENING_COLOR}, ${o})`,
			  strokeWidth: 2,
			},
			{
			  data: diaEveningData,
			  color: (o = 1) => `${EVENING_COLOR}, ${o})`,
			  strokeWidth: 2,
			},
		  ],
		  legend: ["Aamu SYS", "Aamu DIA", "Ilta SYS", "Ilta DIA"],
	  }}
      width={chartWidth}
      height={260}
      fromZero={false}
      withDots
      withInnerLines={false}
      bezier
      chartConfig={{
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (o = 1) => `rgba(0, 122, 255, ${o})`,
        labelColor: (o = 1) => `rgba(0,0,0,${o})`,
        propsForLabels: { fontSize: 10 },
      }}
      style={{ borderRadius: 12, marginBottom: 24 }}
    />
  </ScrollView>
)}

	  
      {loading && <Text>Ladataan...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {docs.length === 0 && !loading && !error && (
        <Text>Ei mittauksia saatavilla</Text>
      )}

      {docs.map((d) => (
        <View key={d.date} style={{ marginBottom: 12, padding: 12, borderWidth: 1, borderRadius: 12 }}>
			
          <Text style={{ fontWeight: "600" }}>{d.date}</Text>

          <Text>
            Aamu: SYS {d.bloodPressure?.morning?.reading?.sys ?? "-"} / DIA{" "}
            {d.bloodPressure?.morning?.reading?.dia ?? "-"} (pulse {d.bloodPressure?.morning?.reading?.pulse ?? "-"})
          </Text>

          <Text>
            Ilta: SYS {d.bloodPressure?.evening?.reading?.sys ?? "-"} / DIA{" "}
            {d.bloodPressure?.evening?.reading?.dia ?? "-"} (pulse {d.bloodPressure?.evening?.reading?.pulse ?? "-"})
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
});
