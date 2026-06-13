import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionEventAnalyticsCard } from '@/features/sessions/components/SessionEventAnalyticsCard';
import { SessionDetailsSummary } from '@/features/sessions/components/SessionDetailsSummary';
import { SessionEventTimeline } from '@/features/sessions/components/SessionEventTimeline';
import { useSessionDetails } from '@/features/sessions/hooks/useSessionDetails';

export default function SessionDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const sessionId = Number(rawId ?? 0);
  const { details, isLoading, isError, refetchAll } = useSessionDetails(sessionId);

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-app-background">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
            <Text className="text-xl font-bold text-brand-secondary">
              Unable to load session details
            </Text>
            <Text className="mt-3 text-base leading-6 text-text-secondary">
              Please try again to refresh this reviewed recording.
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

  if (isLoading || !details) {
    return (
      <SafeAreaView className="flex-1 bg-app-background">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#0e3b31" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[18px] px-5 py-7">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface-raised">
            <Ionicons name="arrow-back" size={20} color="#0e3b31" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-[24px] font-bold text-brand-secondary">Session Details</Text>
            <Text className="mt-1 text-sm text-text-secondary">Reviewed recording summary</Text>
          </View>
        </View>

        <SessionDetailsSummary details={details} />
        <SessionEventAnalyticsCard details={details} />
        <SessionEventTimeline title="Detected Event Timeline" events={details.events} />
      </ScrollView>
    </SafeAreaView>
  );
}
