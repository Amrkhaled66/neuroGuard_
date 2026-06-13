import { Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import type { SeizureTrendPoint } from '@/features/seizures/types/seizures.types';

type Props = {
  trend: SeizureTrendPoint[];
  message: string;
};

function sampleTrend(points: SeizureTrendPoint[], maxItems = 8) {
  if (points.length <= maxItems) {
    return points;
  }

  const step = (points.length - 1) / (maxItems - 1);

  return Array.from({ length: maxItems }, (_, index) => {
    const pointIndex = Math.round(index * step);
    return points[Math.min(pointIndex, points.length - 1)];
  });
}

export function SeizureTrendCard({ trend, message }: Props) {
  const sampledTrend = sampleTrend(trend);
  const chartData = sampledTrend.map((item) => ({
    value: item.seizureCount,
    label: item.dateLabel,
  }));

  return (
    <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-lg font-bold text-brand-secondary">Trend</Text>

      {trend.length === 0 ? (
        <Text className="mt-4 text-sm leading-6 text-text-secondary">
          No detected seizure activity in this time range.
        </Text>
      ) : (
        <>
          <View className="mt-5 overflow-hidden rounded-[20px] bg-app-background-soft px-3 py-4">
            <LineChart
              data={chartData}
              width={290}
              height={165}
              spacing={36}
              color="#006044"
              thickness={3}
              curved
              areaChart
              startFillColor="rgba(0, 96, 68, 0.2)"
              endFillColor="rgba(0, 96, 68, 0.02)"
              startOpacity={1}
              endOpacity={0.2}
              dataPointsColor="#006044"
              dataPointsRadius={4}
              dataPointsWidth={0}
              hideRules
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisTextStyle={{
                color: '#708078',
                fontSize: 10,
              }}
              disableScroll
              isAnimated
              animationDuration={500}
              noOfSections={4}
              xAxisLabelTextStyle={{
                color: '#708078',
                fontSize: 10,
              }}
              rulesColor="rgba(130, 215, 177, 0.18)"
              initialSpacing={8}
              endSpacing={8}
            />
          </View>

          <Text className="mt-4 text-sm leading-6 text-text-secondary">{message}</Text>
        </>
      )}
    </View>
  );
}
