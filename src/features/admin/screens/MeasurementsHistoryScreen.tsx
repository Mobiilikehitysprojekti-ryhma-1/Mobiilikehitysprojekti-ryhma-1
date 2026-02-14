import React from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { AdminStackParamList } from "../navigation/types";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BPDoc, fetchLast14BPDocs } from "../state/measurementsHistoryStore";
import { useAuth } from "../../../shared/hooks/useAuth";
import { LineChart } from "react-native-chart-kit";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";

const screenWidth = Dimensions.get("window").width;

type Props = BottomTabScreenProps<AdminStackParamList, "MeasurementsHistory">;

export function MeasurementsHistoryScreen({}: Props) {
	const theme = useTheme();
	const { spacing } = useAppTheme();
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

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [loadData])
	);

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

	const diaMorningData = docs
		.map((d) => d.bloodPressure?.morning?.reading?.dia ?? null)
		.filter((item): item is number => item !== null);

	const chartLabels = chartData.map((item) => item.label);
	const sysMorningData = chartData.map((item) => item.value);
	const sysEveningData = docs
		.map((d) => d.bloodPressure?.evening?.reading?.sys ?? null)
		.filter((item): item is number => item !== null);
	const diaEveningData = docs
		.map((d) => d.bloodPressure?.evening?.reading?.dia ?? null)
		.filter((item): item is number => item !== null);

	const chartWidth = Math.max(screenWidth - spacing.medium * 2, chartData.length * 48);

	if (!user) {
		return (
			<ScreenWrapper>
				<View style={{ flex: 1, padding: spacing.large, justifyContent: "center" }}>
					<BodyText variant="bodyMedium" color={theme.colors.onPrimary}>No user found</BodyText>
				</View>
			</ScreenWrapper>
		);
	}

	return (
		<ScreenWrapper>
			<View style={{ top: spacing.extraLarge, padding: spacing.large, flex: 1 }}>
				<ScrollView contentContainerStyle={{ paddingBottom: spacing.extraLarge }}>
					<HeaderText marginBottom="small" style={{ color: theme.colors.onPrimary }}>
						Bloodpressure history (14 last)
					</HeaderText>
					<BodyText variant="bodyMedium" marginBottom="medium" color={theme.colors.onPrimary}>
						Requested: {docs.length} days
					</BodyText>

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
											data: sysEveningData,
											color: (o = 1) => `${EVENING_COLOR}, ${o})`,
											strokeWidth: 2,
										},
										{
											data: diaEveningData,
											color: (o = 1) => `${EVENING_COLOR}, ${o})`,
											strokeWidth: 2,
										},										{
											data: diaMorningData,
											color: (o = 1) => `${MORNING_COLOR}, ${o})`,
											strokeWidth: 2,
										},
									],
									legend: ["Morning", "Evening"],
								}}
								width={chartWidth}
								height={260}
								fromZero={false}
								withDots
								withInnerLines={false}
								bezier
								chartConfig={{
									backgroundGradientFrom: theme.colors.surface,
									backgroundGradientTo: theme.colors.surface,
									decimalPlaces: 0,
									color: () => theme.colors.primary,
									labelColor: () => theme.colors.onSurface,
									propsForLabels: { fontSize: 10 },
								}}
								style={{ borderRadius: 12, marginBottom: spacing.large }}
							/>
						</ScrollView>
					)}

					{loading && (
						<BodyText variant="bodyMedium" marginBottom="small" color={theme.colors.onPrimary}>Loading...</BodyText>
					)}
					{error && (
						<BodyText variant="bodyMedium" marginBottom="small" style={{ color: theme.colors.error }}>
							{error}
						</BodyText>
					)}
					{docs.length === 0 && !loading && !error && (
						<BodyText variant="bodyMedium" color={theme.colors.onPrimary}>No measurements available</BodyText>
					)}

					{docs.map((d) => (
						<View
							key={d.date}
							style={{
								marginBottom: spacing.medium,
								padding: spacing.medium,
								borderRadius: 0,
								backgroundColor: theme.colors.secondary,
							}}
						>
							<BodyText variant="bodyMedium" style={{ fontWeight: "600" }} marginBottom="small" color={theme.colors.onPrimary}>
								{d.date}
							</BodyText>
							<BodyText variant="bodyMedium" marginBottom="small" color={theme.colors.onPrimary}>
								Morning: SYS {d.bloodPressure?.morning?.reading?.sys ?? "-"} / DIA{" "}
								{d.bloodPressure?.morning?.reading?.dia ?? "-"} (pulse {d.bloodPressure?.morning?.reading?.pulse ?? "-"})
							</BodyText>
							<BodyText variant="bodyMedium" color={theme.colors.onPrimary}>
								Evening: SYS {d.bloodPressure?.evening?.reading?.sys ?? "-"} / DIA{" "}
								{d.bloodPressure?.evening?.reading?.dia ?? "-"} (pulse {d.bloodPressure?.evening?.reading?.pulse ?? "-"})
							</BodyText>
						</View>
					))}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
}
