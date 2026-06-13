import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import type { SessionDetailsViewModel } from '@/features/sessions/types/sessions.types';

type Props = {
  details: SessionDetailsViewModel;
};

export function SessionEventAnalyticsCard({ details }: Props) {
  const totalMixCount = details.durationMix.reduce((sum, item) => sum + item.count, 0);
  const pieData = details.durationMix
    .filter((item) => item.count > 0)
    .map((item) => ({
      value: item.count,
      color: item.color,
      text: String(item.count),
    }));

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Event Analytics</Text>

      {details.hasDetectedEvents ? (
        <>
          <View className="mt-4 rounded-[18px] bg-app-background-soft p-4">
            <Text className="text-sm font-bold text-brand-secondary">Duration Mix</Text>
            <View className="mt-4 flex-row items-center justify-between gap-4">
              <PieChart
                data={pieData}
                donut
                radius={52}
                innerRadius={32}
                strokeWidth={0}
                innerCircleColor="#f4f8f5"
                centerLabelComponent={() => (
                  <View className="items-center">
                    <Text className="text-lg font-bold text-text-primary">{totalMixCount}</Text>
                    <Text className="text-xs text-text-muted">events</Text>
                  </View>
                )}
              />

              <View className="flex-1 gap-3">
                {details.durationMix.map((item) => (
                  <View key={item.label} className="flex-row items-center justify-between gap-3">
                    <View className="flex-1 flex-row items-center gap-2">
                      <View
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className="text-sm text-text-secondary">{item.label}</Text>
                    </View>
                    <Text className="text-sm font-bold text-text-primary">{item.count}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className="mt-4 rounded-[18px] bg-app-background-soft p-4">
            <Text className="text-sm font-bold text-brand-secondary">Where Events Happened</Text>
            <Text className="mt-1 text-xs text-text-muted">
              This line shows where detected events appeared during the recording.
            </Text>

            <View className="mt-4 rounded-[16px] bg-white/60 px-3 py-4">
              <View className="h-3 overflow-hidden rounded-full bg-brand-primary-soft/40">
                {details.recordingSpread.map((item) => (
                  <View
                    key={item.id}
                    className="absolute h-3 rounded-full bg-brand-primary"
                    style={{
                      left: `${item.startPercent}%`,
                      width: `${item.widthPercent}%`,
                    }}
                  />
                ))}
              </View>

              <View className="mt-3 flex-row justify-between">
                <Text className="text-[11px] text-text-muted">Start</Text>
                <Text className="text-[11px] text-text-muted">{details.durationLabel}</Text>
              </View>

              <View className="mt-4 gap-2">
                {details.recordingSpread.map((item, index) => (
                  <View key={item.id} className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold text-text-secondary">Event {index + 1}</Text>
                    <Text className="text-xs text-text-muted">{item.startLabel}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </>
      ) : (
        <Text className="mt-4 text-sm leading-6 text-text-secondary">
          Analytics will appear here when a reviewed session includes detected seizure activity.
        </Text>
      )}
    </View>
  );
}
