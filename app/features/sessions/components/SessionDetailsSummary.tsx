import { Text, View } from 'react-native';
import type { SessionDetailsViewModel } from '@/features/sessions/types/sessions.types';

type Props = {
  details: SessionDetailsViewModel;
};

export function SessionDetailsSummary({ details }: Props) {
  return (
    <View className="rounded-[28px] border border-border-subtle bg-surface-raised p-5 shadow-card">

      {/* HEADER */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">

          <Text className="text-sm font-bold uppercase tracking-wider text-text-muted">
            Reviewed Session
          </Text>

          <Text className="mt-2 text-base font-semibold text-text-primary leading-6">
            {details.reviewedDateLabel}
          </Text>

        </View>

        {/* STATUS BADGE */}
        <View className="rounded-full bg-brand-primary-soft/50 px-4 py-2">
          <Text className="text-xs font-bold text-brand-secondary">
            {details.statusLabel}
          </Text>
        </View>
      </View>

      {/* DIVIDER */}
      <View className="my-5 h-[1px] bg-border-subtle" />

      {/* METRICS GRID */}
      <View className="flex-row flex-wrap gap-3">
        {details.metrics.map((metric) => (
          <View
            key={metric.label}
            className="flex-1 min-w-[140px] rounded-2xl bg-app-background-soft p-4"
          >
            <Text className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              {metric.label}
            </Text>

            <Text className="mt-2 text-lg font-extrabold text-text-primary">
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}