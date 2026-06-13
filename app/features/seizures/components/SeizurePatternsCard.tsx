import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import type {
  DurationDistributionItem,
  SeizurePatternInsight,
} from '@/features/seizures/types/seizures.types';

type Props = {
  insights: SeizurePatternInsight[];
  distribution: DurationDistributionItem[];
};

const distributionColors = ['#006044', '#9ef4cc', 'rgba(130, 215, 177, 0.45)'];

export function SeizurePatternsCard({ insights, distribution }: Props) {
  const totalDistribution = distribution.reduce((sum, item) => sum + item.count, 0);
  const pieData = distribution.map((item, index) => ({
    value: item.count,
    color: distributionColors[index] ?? '#006044',
    text: String(item.count),
  }));

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Pattern Insights</Text>

      {insights.length === 0 ? (
        <Text className="mt-4 text-sm leading-6 text-text-secondary">
          Pattern insights will appear when detected events are available.
        </Text>
      ) : (
        <View className="mt-4 gap-3">
          {insights.map((insight) => (
            <View
              key={insight.title}
              className="rounded-[18px] border border-border-subtle bg-app-background-soft p-4">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
                {insight.title}
              </Text>
              <Text className="mt-2 text-lg font-bold text-text-primary">{insight.value}</Text>
              <Text className="mt-1 text-sm text-text-secondary">{insight.subtitle}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="mt-5 rounded-[18px] bg-app-background-soft p-4">
        <Text className="text-sm font-bold text-brand-secondary">Duration Mix</Text>
        {totalDistribution === 0 ? (
          <Text className="mt-3 text-sm leading-6 text-text-secondary">
            Duration insights will appear when detected events are available.
          </Text>
        ) : (
          <View className="mt-4 flex-row items-center justify-between gap-4">
            <View className="items-center justify-center">
              <PieChart
                data={pieData}
                donut
                radius={54}
                innerRadius={34}
                strokeWidth={0}
                innerCircleColor="#f4f8f5"
                centerLabelComponent={() => (
                  <View className="items-center">
                    <Text className="text-lg font-bold text-text-primary">
                      {totalDistribution}
                    </Text>
                    <Text className="text-xs text-text-muted">events</Text>
                  </View>
                )}
              />
            </View>

            <View className="flex-1 gap-3">
              {distribution.map((item, index) => (
                <View key={item.label} className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 flex-row items-center gap-2">
                    <View
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: distributionColors[index] ?? '#006044' }}
                    />
                    <Text className="text-sm text-text-secondary">{item.label}</Text>
                  </View>
                  <Text className="text-sm font-bold text-text-primary">{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
