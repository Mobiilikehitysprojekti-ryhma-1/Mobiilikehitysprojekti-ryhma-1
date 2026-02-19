import { View, ScrollView } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useHomeSchedule } from "../state/homeScheduleStore";
import { TodayFoodCard } from "../components/TodayFoodCard";
import { TodayMedsCard } from "../components/TodayMedsCard";
import { ScreenWrapper } from "../../../shared/components/ScreenWrapper";
import { BodyText } from "../../../shared/components/Texts/BodyText";
import { useAppTheme } from "../../../shared/theme/theme";
import { SecondaryButton } from "../../../shared/components/Button/SecondaryButton";
import { SettingsButton } from "../../../shared/components/Button/SettingsButton";
import Notifications from "../components/Notifications";

export default function HomeScreen() {
	const theme = useTheme();
	const { spacing } = useAppTheme();
	const { user } = useAuth();
	const {
		mealsSchedule,
		medsSchedule,
		todayStatus,
		loading,
		error,
		refetch,
		markMealTaken,
		markMedTaken,
	} = useHomeSchedule(user?.uid);

	if (loading && !mealsSchedule && !medsSchedule) {
		return (
			<ScreenWrapper>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.large }}>
					<ActivityIndicator size="large" color={theme.colors.primary} />
					<BodyText variant="bodyMedium" style={{ marginTop: spacing.medium }}>
						Ladataan...
					</BodyText>
				</View>
			</ScreenWrapper>
		);
	}

	if (error) {
		return (
			<ScreenWrapper>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.large }}>
					<BodyText
						variant="bodyMedium"
						style={{ color: theme.colors.error, textAlign: "center", marginBottom: spacing.medium }}
					>
						{error}
					</BodyText>
					<SecondaryButton buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary} onPress={refetch}>
						Yritä uudelleen
					</SecondaryButton>
				</View>
			</ScreenWrapper>
		);
	}

	return (
		<ScreenWrapper>
			<View style={{
				position: 'absolute',
				top: spacing.extraLarge + 30,
				right: spacing.medium,
				zIndex: 10
			}}>
				<SettingsButton />
			</View>
			<View style={{top: spacing.extraLarge, padding: spacing.large, marginTop: spacing.extraLarge }}></View>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ top: spacing.extraLarge, padding: spacing.large, paddingBottom: spacing.extraLarge }}
				showsVerticalScrollIndicator={false}
			>
				<Notifications mealsSchedule={mealsSchedule} medsSchedule={medsSchedule} />
				<TodayFoodCard
					mealsSchedule={mealsSchedule}
					mealsStatus={todayStatus?.meals}
					onMarkTaken={markMealTaken}
				/>
				<TodayMedsCard
					medsSchedule={medsSchedule}
					medsStatus={todayStatus?.meds}
					onMarkTaken={markMedTaken}
				/>
			</ScrollView>
		</ScreenWrapper>
	);
}
