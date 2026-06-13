import { Pressable, Text, View } from 'react-native';
import type { SeizureRange } from '@/features/seizures/types/seizures.types';

type Props = {
  selectedRange: SeizureRange;
  onSelectRange: (range: SeizureRange) => void;
};

const RANGES: SeizureRange[] = [30, 90, 180];

export function SeizureRangeTabs({ selectedRange, onSelectRange }: Props) {
  return (
    <View className="flex-row rounded-[18px] border border-border-subtle bg-surface-raised p-1 shadow-card">
      {RANGES.map((range) => {
        const isSelected = selectedRange === range;

        return (
          <Pressable
            key={range}
            onPress={() => onSelectRange(range)}
            className={`min-h-[44px] flex-1 items-center justify-center rounded-[14px] ${
              isSelected ? 'bg-brand-primary' : 'bg-transparent'
            }`}>
            <Text
              className={`text-sm font-bold ${
                isSelected ? 'text-white' : 'text-text-secondary'
              }`}>
              {range} days
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
