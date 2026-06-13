import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SessionDateFilterTabs } from '@/features/sessions/components/SessionDateFilterTabs';
import { SessionsHeader } from '@/features/sessions/components/SessionsHeader';
import { SessionsList } from '@/features/sessions/components/SessionsList';
import { useSessionsList } from '@/features/sessions/hooks/useSessionsList';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SessionsScreen() {
  const {
    items,
    totalAnalyzedCount,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    isError,
    refetchAll,
  } = useSessionsList();

  if (isError) {
    return (
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
            <Text className="text-xl font-bold text-brand-secondary">Unable to load sessions</Text>
            <Text className="mt-3 text-base leading-6 text-text-secondary">
              Please try again to refresh your reviewed recordings.
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

  if (isLoading) {
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
        <SessionsHeader />
        <SessionDateFilterTabs
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
        <SessionsList
          items={items}
          totalAnalyzedCount={totalAnalyzedCount}
          onOpenSession={(session) => router.push(`/sessions/${session.id}` as never)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
