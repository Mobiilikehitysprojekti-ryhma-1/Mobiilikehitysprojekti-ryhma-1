import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Icon, useTheme } from "react-native-paper";
import type { MealsItems } from "../../admin/data/mealsRepository";
import type { DailyStatusDoc } from "../../admin/data/dailyStatusRepository";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { useAppTheme } from "../../../shared/theme/theme";

type MealKey = keyof MealsItems;

const MEAL_ORDER: MealKey[] = ["breakfast", "lunch", "dinner", "supper"];

type Props = {
	mealsSchedule: MealsItems | null;
	mealsStatus: DailyStatusDoc["meals"] | undefined;
	onMarkTaken?: (key: MealKey) => void;
};

function StatusIcon({
	status,
	size = 22,
}: {
	status: "ok" | "not ok" | "pending";
	size?: number;
}) {
	const theme = useTheme();
	switch (status) {
		case "ok":
			return <Icon size={size} source="check-circle" color={theme.colors.primary} />;
		case "not ok":
			return <Icon size={size} source="close-circle" color={theme.colors.error} />;
		default:
			return <Icon size={size} source="circle-outline" color={theme.colors.surface} />;
	}
}

export function TodayFoodCard({
	mealsSchedule,
	mealsStatus,
	onMarkTaken,
}: Props) {
	const theme = useTheme();
	const { spacing } = useAppTheme();

	if (!mealsSchedule) {
		return (
			<Card style={{ backgroundColor: theme.colors.secondary, borderRadius: 0,marginBottom: spacing.medium }}>
				<Card.Content>
					<HeaderText marginBottom="small">Food today</HeaderText>
					<BodyText variant="bodySmall" style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
						Food times are not set.
					</BodyText>
				</Card.Content>
			</Card>
		);
	}

	return (
		<Card style={{ backgroundColor: theme.colors.secondary, borderRadius: 0, marginBottom: spacing.medium }}>
			<Card.Content>
				<HeaderText marginBottom={spacing.medium} variant="titleMedium" style={{ borderBottomWidth: 1, borderColor: theme.colors.primary }}>
					Food today
				</HeaderText>
				<View style={styles.rows}>
					{MEAL_ORDER.map((key) => {
						const item = mealsSchedule[key];
						const status = mealsStatus?.[key] ?? "pending";
						const row = (
							<View key={key} style={[styles.row, { marginBottom: spacing.small }]}>
								<BodyText style={styles.label}>{item.label}</BodyText>
								<BodyText style={styles.time}>{item.time}</BodyText>
								<View style={styles.statusWrap}>
									{onMarkTaken && status !== "ok" && (
										<TouchableOpacity
											style={[styles.markBtn, { marginLeft: spacing.small }]}
											onPress={() => onMarkTaken(key)}
											accessibilityLabel={`Mark ${item.label} as taken`}
										>
											<BodyText variant="bodySmall">
												Mark as taken
											</BodyText>
										</TouchableOpacity>
									)}
										<StatusIcon status={status} />
								</View>
							</View>
						);
						return row;
					})}
				</View>
			</Card.Content>
		</Card>
	);
}

const styles = StyleSheet.create({
	rows: {
		gap: 4,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	label: {
		width: "35%",
	},
	time: {
		width: "20%",
	},
	statusWrap: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	markBtn: {
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
});
