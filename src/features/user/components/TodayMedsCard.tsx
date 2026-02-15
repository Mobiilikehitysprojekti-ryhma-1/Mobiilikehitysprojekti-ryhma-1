import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Icon, useTheme } from "react-native-paper";
import type { MedsItems } from "../../admin/data/medsRepository";
import type { DailyStatusDoc } from "../../admin/data/dailyStatusRepository";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { HeaderText } from "../../../shared/components/Texts/HeaderText";
import { useAppTheme } from "../../../shared/theme/theme";

type MedKey = keyof MedsItems;

const MED_ORDER: MedKey[] = ["morning", "noon", "evening", "night"];

type Props = {
	medsSchedule: MedsItems | null;
	medsStatus: DailyStatusDoc["meds"] | undefined;
	onMarkTaken?: (key: MedKey) => void;
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

export function TodayMedsCard({
	medsSchedule,
	medsStatus,
	onMarkTaken,
}: Props) {
	const theme = useTheme();
	const { spacing } = useAppTheme();

	if (!medsSchedule) {
		return (
			<Card style={[styles.card, { backgroundColor: theme.colors.secondary, borderRadius: 0 }]}>
				<Card.Content>
					<HeaderText marginBottom="small">Meds today</HeaderText>
					<BodyText variant="bodySmall" style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
						Meds times are not set.
					</BodyText>
				</Card.Content>
			</Card>
		);
	}

	return (
		<Card style={[styles.card, { backgroundColor: theme.colors.secondary, borderRadius: 0 }]}>
			<Card.Content>
				<HeaderText marginBottom={spacing.medium} variant="titleMedium" style={{ borderBottomWidth: 1, borderColor: theme.colors.primary }}>
					Meds today
				</HeaderText>
				<View style={styles.rows}>
					{MED_ORDER.map((key) => {
						const item = medsSchedule[key];
						const status = medsStatus?.[key] ?? "pending";
						return (
							<View key={key} style={[styles.row, { marginBottom: spacing.small }]}>
								<BodyText style={styles.label}>{item.label}</BodyText>
								<BodyText style={styles.time}>{item.time}</BodyText>
								<View style={styles.statusWrap}>
									<StatusIcon status={status} />
									{onMarkTaken && status !== "ok" && (
										<TouchableOpacity
											style={[styles.markBtn, { marginLeft: spacing.small }]}
											onPress={() => onMarkTaken(key)}
											accessibilityLabel={`Mark ${item.label} as taken`}
										>
											<BodyText variant="bodySmall" style={{ color: theme.colors.primary }}>
												Mark as taken
											</BodyText>
										</TouchableOpacity>
									)}
								</View>
							</View>
						);
					})}
				</View>
			</Card.Content>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		marginBottom: 12,
	},
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
