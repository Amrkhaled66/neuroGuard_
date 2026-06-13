import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { AlertDetailSheet } from '@/features/alerts/components/AlertDetailSheet';
import { AlertsHeader } from '@/features/alerts/components/AlertsHeader';
import { AlertsList } from '@/features/alerts/components/AlertsList';
import { AlertsSummaryCard } from '@/features/alerts/components/AlertsSummaryCard';
import { useAlertsDashboard } from '@/features/alerts/hooks/useAlertsDashboard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AlertsScreen() {
  const {
    dashboard,
    selectedAlert,
    isLoading,
    isError,
    hasNextPage,
    isLoadingMore,
    openAlert,
    closeAlert,
    loadMore,
    refetchAll,
  } = useAlertsDashboard();

  if (isError) {
    return (
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
            <Text className="text-xl font-bold text-brand-secondary">Unable to load alerts</Text>
            <Text className="mt-3 text-base leading-6 text-text-secondary">
              Please try again to refresh your recent updates.
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
        <AlertsHeader />
        <AlertsSummaryCard
          unreadCount={dashboard.unreadCount}
          totalCount={dashboard.totalCount}
        />
        <AlertsList
          items={dashboard.items}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
          onOpenAlert={(alert) => void openAlert(alert)}
          onLoadMore={() => void loadMore()}
        />
      </ScrollView>
      <AlertDetailSheet alert={selectedAlert} onClose={closeAlert} />
    </SafeAreaView>
  );
}
