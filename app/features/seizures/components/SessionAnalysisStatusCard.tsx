import { Text, View } from 'react-native';
import type { SessionAnalysisStatus } from '@/features/seizures/types/seizures.types';

type Props = {
  status: SessionAnalysisStatus;
};

export function SessionAnalysisStatusCard({ status }: Props) {
  if (status.processingSessions === 0 && status.failedSessions === 0) {
    return null;
  }

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Analysis Status</Text>
      <Text className="mt-2 text-sm leading-6 text-text-secondary">
        Some uploaded sessions are still being processed or need review before they can appear in
        your seizure history.
      </Text>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-[18px] bg-app-background-soft p-4">
          <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
            Processing
          </Text>
          <Text className="mt-2 text-2xl font-bold text-text-primary">
            {status.processingSessions}
          </Text>
        </View>
        <View className="flex-1 rounded-[18px] bg-app-background-soft p-4">
          <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
            Failed
          </Text>
          <Text className="mt-2 text-2xl font-bold text-text-primary">
            {status.failedSessions}
          </Text>
        </View>
      </View>
    </View>
  );
}
