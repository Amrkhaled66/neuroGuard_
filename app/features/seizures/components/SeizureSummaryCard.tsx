import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import type {
  SeizureRange,
  SeizureSummaryCardData,
} from '@/features/seizures/types/seizures.types';

type Props = {
  summary: SeizureSummaryCardData;
  selectedRange: SeizureRange;
  hasAnyEvents: boolean;
};

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type SummaryMetric = {
  label: string;
  value: string;
  icon: IoniconName;
  color: string;
};

export function SeizureSummaryCard({ summary, selectedRange, hasAnyEvents }: Props) {
  const heroTitle = hasAnyEvents
    ? `${summary.totalSeizures} detected event${summary.totalSeizures === 1 ? '' : 's'}`
    : 'No detected seizure activity';

  const heroSubtitle = hasAnyEvents
    ? summary.sessionsWithSeizures > 0
      ? `Detected across ${summary.sessionsWithSeizures} uploaded session${
          summary.sessionsWithSeizures === 1 ? '' : 's'
        } in the last ${selectedRange} days.`
      : `Detected activity was found in your recent uploads from the last ${selectedRange} days.`
    : `Your uploaded sessions from the last ${selectedRange} days did not include detected seizure activity.`;

  const heroIcon: IoniconName = hasAnyEvents ? 'pulse-outline' : 'shield-checkmark-outline';
  const heroColor = hasAnyEvents ? '#ef4444' : '#22c55e';

  const items: SummaryMetric[] = hasAnyEvents
    ? [
        {
          label: 'Average Event Length',
          value: summary.avgDurationLabel,
          icon: 'time-outline',
          color: '#f59e0b',
        },
        {
          label: 'Most In One Day',
          value: `${summary.maxDailySeizures}`,
          icon: 'trending-up-outline',
          color: '#ef4444',
        },
      ]
    : [
        {
          label: 'Sessions With Events',
          value: String(summary.sessionsWithSeizures),
          icon: 'calendar-outline',
          color: '#3b82f6',
        },
        {
          label: 'Average Event Length',
          value: summary.avgDurationLabel,
          icon: 'time-outline',
          color: '#f59e0b',
        },
      ];

  return (
    <View className="rounded-[28px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold uppercase tracking-wider text-text-muted">
          This Period
        </Text>

        <View className="rounded-full bg-app-background-soft px-3 py-1.5">
          <Text className="text-xs font-bold text-text-secondary">
            Last {selectedRange} days
          </Text>
        </View>
      </View>

      {/* Hero Section */}
      <View className="mt-5 rounded-[22px] bg-app-background-soft p-4">
        <View className="flex-row items-start gap-4">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${heroColor}18` }}
          >
            <Ionicons name={heroIcon} size={24} color={heroColor} />
          </View>

          <View className="flex-1">
            <Text className="text-2xl font-extrabold leading-8 text-brand-secondary">
              {heroTitle}
            </Text>

            <Text className="mt-2 text-sm leading-6 text-text-secondary">
              {heroSubtitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Metrics */}
      <View className="mt-4 flex-row gap-3">
        {items.map((item) => (
          <View
            key={item.label}
            className="flex-1 rounded-[20px] border border-border-subtle bg-surface-raised p-4"
          >
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-full bg-app-background-soft">
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>

            <Text className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              {item.label}
            </Text>

            <Text className="mt-2 text-xl font-extrabold text-text-primary">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}