import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { HomeProgressSummary } from '@/features/home/types/home.types';

type Props = {
  progress: HomeProgressSummary;
};

export function TodayProgressCard({ progress }: Props) {
  const chartSize = 112;
  const strokeWidth = 14;
  const radius = (chartSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - progress.completionRatio);

  return (
    <View className="flex-1 justify-between rounded-3xl border border-border-subtle bg-surface-raised p-5 shadow-card">
      <Text className="text-base font-bold text-brand-secondary">Today&apos;s Progress</Text>

      <View className=" items-center rounded-[20px] px-4 ">
        <View className="items-center justify-center">
          <Svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
            <Circle
              cx={chartSize / 2}
              cy={chartSize / 2}
              r={radius}
              stroke="rgba(130, 215, 177, 0.28)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={chartSize / 2}
              cy={chartSize / 2}
              r={radius}
              stroke="#82d7b1"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              origin={`${chartSize / 2}, ${chartSize / 2}`}
              rotation={-90}
            />
          </Svg>

          <View className="absolute items-center">
            <Text className="text-[24px] font-bold text-brand-secondary">{progress.takenCount} / {progress.totalCount}</Text>

          </View>
        </View>
      </View>

      <View className="flex-row items-center">
        <Text className="text-xs w-fit mx-auto text-text-secondary">Medication Taken</Text>
      </View>
    </View>
  );
}
