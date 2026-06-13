import { Text, View } from 'react-native';
import { SessionCard } from '@/features/sessions/components/SessionCard';
import type { SessionCardItem } from '@/features/sessions/types/sessions.types';

type Props = {
  items: SessionCardItem[];
  totalAnalyzedCount: number;
  onOpenSession: (session: SessionCardItem) => void;
};

export function SessionsList({ items, totalAnalyzedCount, onOpenSession }: Props) {
  if (totalAnalyzedCount === 0) {
    return (
      <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
        <Text className="text-lg font-bold text-brand-secondary">No reviewed sessions yet</Text>
        <Text className="mt-2 text-sm leading-6 text-text-secondary">
          Uploaded EEG recordings will appear here after analysis is complete.
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-6 shadow-card">
        <Text className="text-lg font-bold text-brand-secondary">
          No reviewed sessions in this time range
        </Text>
        <Text className="mt-2 text-sm leading-6 text-text-secondary">
          Try a wider date range to see earlier reviewed recordings.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {items.map((item) => (
        <SessionCard key={item.id} session={item} onPress={onOpenSession} />
      ))}
    </View>
  );
}
