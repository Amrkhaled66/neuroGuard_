import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import type { MedicationAdherenceResponse } from '@/features/medication/types/medication.types';

type Props = {
  summary: MedicationAdherenceResponse['summary'];
  trend: MedicationAdherenceResponse['trend'];
};

function sampleTrend(points: MedicationAdherenceResponse['trend'], maxItems = 7) {
  if (points.length <= maxItems) {
    return points;
  }

  const lastIndex = points.length - 1;
  const step = lastIndex / (maxItems - 1);

  return Array.from({ length: maxItems }, (_, index) => {
    const pointIndex = Math.round(index * step);
    return points[pointIndex];
  });
}

export function MedicationAdherenceInsightsCard({ summary, trend }: Props) {
  const sampledTrend = sampleTrend(trend);
  const totalLogs = Math.max(
    summary.takenCount + summary.missedCount + summary.scheduledCount,
    1,
  );

  const stackData = sampledTrend.map((item) => ({
    stacks: [
      { value: item.missed, color: '#9ef4cc' },
      { value: item.taken, color: '#006044' },
    ],
    label: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(item.date)),
  }));

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Adherence Insights</Text>

      <View className="mt-4 flex-row gap-4">
        <View className="w-[112px] items-center rounded-[22px] bg-app-background-soft px-4 py-5">
          <Text className="text-2xl font-bold text-text-primary">{summary.adherenceRate}%</Text>
          <Text className="mt-1 text-sm font-semibold text-brand-secondary">On track</Text>
          <View className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/80">
            <View
              className="h-full rounded-full bg-brand-primary"
              style={{ width: `${summary.adherenceRate}%` }}
            />
          </View>
          <Text className="mt-3 text-center text-xs font-bold uppercase tracking-[1px] text-text-muted">
            30-day adherence
          </Text>
        </View>

        <View className="flex-1 gap-3">
          {[
            {
              label: 'Taken',
              value: summary.takenCount,
              color: 'bg-brand-primary',
            },
            {
              label: 'Missed',
              value: summary.missedCount,
              color: 'bg-brand-primary-soft',
            },
            {
              label: 'Scheduled logs',
              value: summary.scheduledCount,
              color: 'bg-surface-soft',
            },
          ].map((item) => (
            <View key={item.label}>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-text-secondary">{item.label}</Text>
                <Text className="text-sm font-semibold text-text-primary">{item.value}</Text>
              </View>
              <View className="mt-2 h-2 overflow-hidden rounded-full bg-app-background-soft">
                <View
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${(item.value / totalLogs) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-[18px] bg-app-background-soft p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-brand-secondary">Recent pattern</Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1.5">
              <View className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
              <Text className="text-xs text-text-secondary">Taken</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="h-2.5 w-2.5 rounded-full bg-brand-primary-soft" />
              <Text className="text-xs text-text-secondary">Missed</Text>
            </View>
          </View>
        </View>

        {stackData.length === 0? (
          <Text className="mt-4 text-sm text-text-secondary">
            No adherence trend is available yet.
          </Text>
        ) : (
          <View className="mt-4 overflow-hidden rounded-2xl bg-white/70 px-2 py-3">
            <BarChart
              width={280}
              height={150}
              barWidth={22}
              spacing={16}
              noOfSections={4}
              stackData={stackData}
              roundedTop
              roundedBottom
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelsHeight={40}
              xAxisLabelTextStyle={{ color: '#708078', fontSize: 10 }}
              disableScroll
              isAnimated
              animationDuration={500}
            />
          </View>
        )}
      </View>
    </View>
  );
}
