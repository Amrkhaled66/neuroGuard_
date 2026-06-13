import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { RecentSeizureEventsList } from '@/features/seizures/components/RecentSeizureEventsList';
import { SeizureHeader } from '@/features/seizures/components/SeizureHeader';
import { SeizurePatternsCard } from '@/features/seizures/components/SeizurePatternsCard';
import { SeizureRangeTabs } from '@/features/seizures/components/SeizureRangeTabs';
import { SeizureSummaryCard } from '@/features/seizures/components/SeizureSummaryCard';
import { SeizureTrendCard } from '@/features/seizures/components/SeizureTrendCard';
import { useSeizureDashboard } from '@/features/seizures/hooks/useSeizureDashboard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SeizuresScreen() {
  const {
    dashboard,
    selectedRange,
    setSelectedRange,
    isLoading,
    isError,
    hasNextPage,
    isLoadingMore,
    loadMore,
    refetchAll,
  } = useSeizureDashboard();

  if (isError) {
    return (
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
            <Text className="text-xl font-bold text-brand-secondary">Unable to load seizures</Text>
            <Text className="mt-3 text-base leading-6 text-text-secondary">
              Please try again to refresh your seizure activity.
            </Text>
            <Pressable
              onPress={() => void refetchAll()}
              className="mt-6 min-h-[52px] items-center justify-center rounded-[18px] bg-brand-primary">
              <Text className="text-base font-bold text-text-on-brand">Retry</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (isLoading || !dashboard) {
    return (
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#0e3b31" />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[18px] px-5 py-7">
        <SeizureHeader />
        <SeizureRangeTabs
          selectedRange={selectedRange}
          onSelectRange={setSelectedRange}
        />
        <SeizureSummaryCard
          summary={dashboard.summary}
          selectedRange={dashboard.selectedRange}
          hasAnyEvents={dashboard.hasAnyEvents}
        />
        <SeizureTrendCard trend={dashboard.trend} message={dashboard.trendMessage} />
        <SeizurePatternsCard
          insights={dashboard.patternInsights}
          distribution={dashboard.durationDistribution}
        />
        <RecentSeizureEventsList
          events={dashboard.recentEvents}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
          onLoadMore={() => void loadMore()}
        />
        {/* <SessionAnalysisStatusCard status={dashboard.sessionStatus} /> */}
        <View className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}
