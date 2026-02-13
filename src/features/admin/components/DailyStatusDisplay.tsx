import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, ActivityIndicator, Icon, useTheme } from "react-native-paper";
import type { DailyStatusDoc } from "../data/dailyStatusRepository";
import { useAppTheme } from "../../../shared/theme/theme";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";

type Props = {
	statuses: DailyStatusDoc[];
	loading?: boolean;
};

export function DailyStatusDisplay({ statuses, loading }: Props) {
	const theme = useTheme();
	const { spacing, width } = useAppTheme();
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
		const iconSize = 20;

		switch (status) {
			case "ok":
				return <Icon size={iconSize} source="check-circle" color={theme.colors.primary} />;

			case "not ok":
				return <Icon size={iconSize} source="close-circle" color={theme.colors.error} />;

			default:
				return <Icon size={iconSize} source="circle-outline" color={theme.colors.surface} />;
		}
	};

	const renderMealsStatus = (meals: DailyStatusDoc["meals"]) => {
		return (
			<View style={{ flexDirection: "row" }}>
				{renderStatusSymbol(meals.breakfast)}
				{renderStatusSymbol(meals.lunch)}
				{renderStatusSymbol(meals.dinner)}
				{renderStatusSymbol(meals.supper)}
			</View>
		);
	};

	const renderMedsStatus = (meds: DailyStatusDoc["meds"]) => {
		return (
			<View style={{ flexDirection: "row" }}>
				{renderStatusSymbol(meds.morning)}
				{renderStatusSymbol(meds.noon)}
				{renderStatusSymbol(meds.evening)}
				{renderStatusSymbol(meds.night)}
			</View>
		);
	};

	const renderBloodPressureStatus = (bloodPressure?: DailyStatusDoc["bloodPressure"]) => {
		const morningStatus = bloodPressure?.morning?.status || "pending";
		const eveningStatus = bloodPressure?.evening?.status || "pending";
		return {
			morning: renderStatusSymbol(morningStatus),
			evening: renderStatusSymbol(eveningStatus),
		};
	};

	if (loading) {
		return (
			<View style={{ flexDirection: "row", alignItems: "center", gap: spacing.extraSmall, padding: spacing.medium }}>
				<ActivityIndicator size="small" />
				<BodyText variant="bodySmall" marginLeft="small">Loading status...</BodyText>
			</View>
		);
	}

	if (statuses.length === 0) {
		return (
			<Card style={{ backgroundColor: theme.colors.secondary }}>
				<Card.Content>
					<BodyText variant="bodyMedium" style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
						No status data available yet
					</BodyText>
				</Card.Content>
			</Card>
		);
	}

	return (
		<ScrollView>
			<View style={{ flex: 1, width: width.full, gap: 12 }}>
				{statuses.map((status) => (
					<Card key={status.date} style={{ backgroundColor: theme.colors.secondary, borderRadius: 0 }}>
						<Card.Content>
							<HeaderText marginBottom={spacing.medium} variant={"titleMedium"} style={{ borderBottomWidth: 1, borderColor: theme.colors.primary }} >
								{formatDate(status.date)}
							</HeaderText>

							<View style={{ flexDirection: "row", marginTop: spacing.small, alignItems: "center" }}>
								<BodyText style={{ width: width.half, marginBottom: spacing.small }}>Food:</BodyText>
								<View style={styles.status}>
									<BodyText marginBottom="small">{renderMealsStatus(status.meals)}</BodyText>
								</View>
							</View>

							<View style={{ flexDirection: "row", marginTop: spacing.small, alignItems: "center" }}>
								<BodyText style={{ width: width.half, marginBottom: spacing.small }}>Medication:</BodyText>
								<View style={styles.status}>
									<BodyText marginBottom="small">{renderMedsStatus(status.meds)}</BodyText>
								</View>
							</View>

							<View style={{ flexDirection: "row", marginTop: spacing.small, alignItems: "center" }}>
								<BodyText style={{ width: width.half, marginBottom: spacing.small }}>Blood pressure:</BodyText>
								<View style={{ flexDirection: "column", marginBottom: spacing.small }}>
									<BodyText marginBottom="small">Morning: {renderBloodPressureStatus(status.bloodPressure).morning} </BodyText>
									<BodyText marginBottom="small">Evening:  {renderBloodPressureStatus(status.bloodPressure).evening}</BodyText>
								</View>
							</View>

							<View style={{ flexDirection: "row", marginVertical: spacing.small, alignItems: "center" }}>
								<BodyText marginBottom="small" style={{ width: width.half }}>Location:</BodyText>
								<View style={styles.status}>
									{status.location.stayedInArea ? (
										<>
											<BodyText marginBottom="small">Stayed in area </BodyText>
											<Icon size={20} source="check-circle" color={theme.colors.tertiary} />
										</>
									) : (
										<>
											<Icon size={20} source="close-circle" color={theme.colors.error} />
											<BodyText style={{ color: theme.colors.error, marginLeft: spacing.extraSmall }}>Left area</BodyText>
										</>
									)}

									{status.location.breaches !== undefined && status.location.breaches > 0 && (
										<BodyText variant="bodySmall" style={{ color: theme.colors.error }}> ({status.location.breaches} breaches)</BodyText>
									)}
								</View>
							</View>
						</Card.Content>
					</Card>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({

	status: {
		flex: 1,
		flexDirection: "row",
	},
});