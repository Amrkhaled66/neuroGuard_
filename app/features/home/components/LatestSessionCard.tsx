import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { HomeSessionSummary } from "@/features/home/types/home.types";

type Props = {
  session: HomeSessionSummary | null;
};

export function LatestSessionCard({ session }: Props) {
  if (!session) {
    return (
      <View className="rounded-[24px] w-[49%] border border-border-subtle bg-surface-raised p-5 shadow-card">
        <Text className="text-lg font-bold text-brand-secondary">Latest Session</Text>
        <Text className="mt-4 text-sm leading-6 text-text-secondary">
          No sessions uploaded yet
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-[24px] w-[49%] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View>
            <Text className="text-lg font-bold text-brand-secondary">
              Latest Session
            </Text>
          </View>
        </View>


      </View>

      <View className="mt-5 gap-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={17} color="#1b5d4a" />
          <Text className="text-sm font-medium text-text-primary">
            {session.dateLabel}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={17} color="#1b5d4a" />
          <Text className="text-sm text-text-secondary">
            {session.durationLabel}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Ionicons name="analytics-outline" size={17} color="#1b5d4a" />
          <Text className="text-sm text-text-secondary">
            {session.eventCount} events found
          </Text>
        </View>
      </View>

      <Pressable className="mt-5 flex-row items-center justify-center gap-2 rounded-[16px] bg-brand-primary-soft px-4 py-3">
        <Text className="text-sm font-semibold text-brand-secondary">
          View details
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#0e3b31" />
      </Pressable>
    </View>
  );
}
