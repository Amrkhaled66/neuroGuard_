import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { SessionCardItem } from '@/features/sessions/types/sessions.types';

type Props = {
  session: SessionCardItem;
  onPress: (session: SessionCardItem) => void;
};

export function SessionCard({ session, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(session)}
      className="rounded-[22px] border border-border-subtle bg-surface-raised p-4 shadow-card">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-2">
          <Text className="text-lg font-bold text-brand-secondary">{session.reviewedDateLabel}</Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-full bg-brand-primary-soft/40 px-3 py-1.5">
              <Text className="text-xs font-bold text-brand-secondary">{session.statusLabel}</Text>
            </View>
            <View className="rounded-full bg-app-background-soft px-3 py-1.5">
              <Text className="text-xs font-bold text-text-secondary">{session.durationLabel}</Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#0e3b31" />
      </View>

      <View className="mt-4 rounded-[18px] bg-app-background-soft p-4">
        <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
          Detection Summary
        </Text>
        <Text className="mt-2 text-base font-bold text-text-primary">{session.eventCountLabel}</Text>
        {session.notePreview ? (
          <Text className="mt-2 text-sm leading-6 text-text-secondary">{session.notePreview}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
