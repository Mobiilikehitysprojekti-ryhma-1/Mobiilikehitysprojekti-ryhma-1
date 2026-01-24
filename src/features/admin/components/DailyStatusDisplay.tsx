import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import type { DailyStatusDoc } from "../data/dailyStatusRepository";

type Props = {
	statuses: DailyStatusDoc[];
	loading?: boolean;
};

export function DailyStatusDisplay({ statuses, loading }: Props) {
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

	const renderMealsStatus = (meals: DailyStatusDoc["meals"]) => {
		return [
			renderStatusSymbol(meals.breakfast),
			renderStatusSymbol(meals.lunch),
			renderStatusSymbol(meals.dinner),
			renderStatusSymbol(meals.supper),
		].join(" ");
	};

	const renderMedsStatus = (meds: DailyStatusDoc["meds"]) => {
		return [
			renderStatusSymbol(meds.morning),
			renderStatusSymbol(meds.noon),
			renderStatusSymbol(meds.evening),
			renderStatusSymbol(meds.night),
		].join(" ");
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" />
				<Text variant="bodySmall" style={styles.loadingText}>Loading status...</Text>
			</View>
		);
	}

	if (statuses.length === 0) {
		return (
			<Card style={styles.card}>
				<Card.Content>
					<Text variant="bodyMedium" style={styles.emptyText}>
						No status data available yet
					</Text>
				</Card.Content>
			</Card>
		);
	}

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
								{status.location.breaches !== undefined && status.location.breaches > 0 && (
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
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		padding: 16,
	},
	loadingText: {
		marginLeft: 8,
	},
	emptyText: {
		textAlign: "center",
		color: "gray",
	},
});
