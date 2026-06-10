import { Text, View } from 'react-native';
import type { HomeUpdateSummary } from '@/features/home/types/home.types';

type Props = {
  update: HomeUpdateSummary | null;
};

export function RecentUpdateCard({ update }: Props) {
  if (!update) {
    return (
      <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
        <Text className="text-lg font-bold text-brand-secondary">Recent Update</Text>
        <Text className="mt-3 text-base leading-6 text-text-secondary">
          No new updates right now.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">{update.title}</Text>
      <Text className="mt-3 text-base leading-6 text-text-secondary">{update.message}</Text>
    </View>
  );
}
