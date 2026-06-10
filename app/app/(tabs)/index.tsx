import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeader } from '@features/home/components/HomeHeader';
import { LatestSessionCard } from '@features/home/components/LatestSessionCard';
import { NextMedicationCard } from '@features/home/components/NextMedicationCard';
import { RecentUpdateCard } from '@features/home/components/RecentUpdateCard';
import { TodayProgressCard } from '@features/home/components/TodayProgressCard';
import { useHomeDashboard } from '@features/home/hooks/useHomeDashboard';
import { useAuth } from '@/features/auth/context/useAuth';
export default function HomeScreen() {
  const { summary, isLoading, isError, isMarkingTaken, markMedicationTaken, refetchAll } =
    useHomeDashboard();
  const { session } = useAuth();
  console.log('User data in HomeScreen:', session);
  if (isLoading || !summary) {
    return (
      <SafeAreaView className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#0e3b31" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
            <Text className="text-xl font-bold text-brand-secondary">Unable to load home</Text>
            <Text className="mt-3 text-base leading-6 text-text-secondary">
              Please try again to refresh your dashboard data.
            </Text>
            <Pressable
              onPress={() => void refetchAll()}
              className="mt-6 min-h-[52px] items-center justify-center rounded-[18px] bg-brand-primary">
              <Text className="text-base font-bold text-text-on-brand">Retry</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[18px] px-5 py-7">
        <HomeHeader
          greeting={summary.greeting}
          subtitle={summary.subtitle}
          initials={summary.patientInitials}
        />
        <NextMedicationCard
          medication={summary.nextMedication}
          onMarkTaken={() => void markMedicationTaken()}
          isSubmitting={isMarkingTaken}
        />
        <View className="flex-row gap-4">
          <TodayProgressCard progress={summary.todayProgress} />
          <LatestSessionCard session={summary.latestSession} />
        </View>
        <RecentUpdateCard update={summary.recentUpdate} />
        <View className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}
