import { Pressable, Text, View } from 'react-native';
import type { SessionDateFilter } from '@/features/sessions/types/sessions.types';

const FILTERS: { label: string; value: SessionDateFilter }[] = [
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: 'All', value: 'all' },
];

type Props = {
  selectedFilter: SessionDateFilter;
  onSelectFilter: (filter: SessionDateFilter) => void;
};

export function SessionDateFilterTabs({ selectedFilter, onSelectFilter }: Props) {
  return (
    <View className="flex-row gap-3">
      {FILTERS.map((filter) => {
        const isSelected = filter.value === selectedFilter;

        return (
          <Pressable
            key={filter.label}
            onPress={() => onSelectFilter(filter.value)}
            className={`min-h-[44px]  flex-1 items-center justify-center rounded-[16px] border px-4 ${
              isSelected
                ? 'border-brand-primary bg-brand-primary'
                : 'border-border-subtle bg-surface-raised'
            }`}>
            <Text
              className={`text-sm font-bold ${
                isSelected ? 'text-white' : 'text-brand-secondary'
              }`}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
