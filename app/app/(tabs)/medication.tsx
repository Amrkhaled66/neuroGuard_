import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ActiveMedicationsList } from '@/features/medication/components/ActiveMedicationsList';
import { MedicationHeader } from '@/features/medication/components/MedicationHeader';
import { NextDoseCard } from '@/features/medication/components/NextDoseCard';
import { TodayMedicationSummaryCard } from '@/features/medication/components/TodayMedicationSummaryCard';
import { TodayScheduleList } from '@/features/medication/components/TodayScheduleList';
import { useMedicationDashboard } from '@/features/medication/hooks/useMedicationDashboard';

export default function MedicationScreen() {
  const {
    dashboard,
    selectedRange,
    setSelectedRange,
    isLoading,
    isError,
    isSubmitting,
    activeMutationId,
    markDoseTaken,
    markDoseMissed,
    refetchAll,
  } = useMedicationDashboard();

  if (isError) {
    return (
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full rounded-3xl border border-border-subtle bg-surface-raised p-6 shadow-card">
            <Text className="text-xl font-bold text-brand-secondary">
              Unable to load medication
            </Text>
            <Text className="mt-3 text-base leading-6 text-text-secondary">
              Please try again to refresh your medication plan.
            </Text>
            <Pressable
              onPress={() => void refetchAll()}
              className="mt-6 min-h-13 items-center justify-center rounded-[18px] bg-brand-primary">
              <Text className="text-base font-bold text-text-on-brand">Retry</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (isLoading || !dashboard) {
    return (
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#0e3b31" />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[18px] px-5 py-7">
        <MedicationHeader />

        <View className="flex-row rounded-[18px] border border-border-subtle bg-surface-raised p-1 shadow-card">
          {[7, 30].map((range) => {
            const isSelected = selectedRange === range;

            return (
              <Pressable
                key={range}
                onPress={() => setSelectedRange(range as 7 | 30)}
                className={`min-h-11 flex-1 items-center justify-center rounded-[14px] ${isSelected ? 'bg-brand-primary' : 'bg-transparent'
                  }`}>
                <Text
                  className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-secondary'
                    }`}>
                  Last {range} days
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TodayMedicationSummaryCard summary={dashboard.todaySummary} />
        <NextDoseCard
          dose={dashboard.nextDose}
          onMarkTaken={(medId) => void markDoseTaken(medId)}
          isSubmitting={isSubmitting && activeMutationId === dashboard.nextDose?.id}
        />
        <TodayScheduleList
          items={dashboard.todaySchedule}
          onMarkTaken={(medId) => void markDoseTaken(medId)}
          onMarkMissed={(medId) => void markDoseMissed(medId)}
          isSubmitting={isSubmitting}
          activeMutationId={activeMutationId}
        />

        <View className="rounded-[24px] border border-border-subtle bg-surface-raised p-5 shadow-card">
          <Text className="text-lg font-bold text-brand-secondary">Adherence Overview</Text>
          <View className="mt-4 flex-row flex-wrap gap-3">
            <View className="min-w-[140px] flex-1 rounded-[18px] bg-app-background-soft p-4">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
                Active Medications
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text-primary">
                {dashboard.adherenceSummary.activeMedications}
              </Text>
            </View>
            <View className="min-w-[140px] flex-1 rounded-[18px] bg-app-background-soft p-4">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
                Adherence Rate
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text-primary">
                {dashboard.adherenceSummary.adherenceRate}%
              </Text>
            </View>
            <View className="min-w-[140px] flex-1 rounded-[18px] bg-app-background-soft p-4">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
                Taken Logs
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text-primary">
                {dashboard.adherenceSummary.takenCount}
              </Text>
            </View>
            <View className="min-w-35 flex-1 rounded-[18px] bg-app-background-soft p-4">
              <Text className="text-xs font-bold uppercase tracking-[1px] text-text-muted">
                Missed Logs
              </Text>
              <Text className="mt-2 text-2xl font-bold text-text-primary">
                {dashboard.adherenceSummary.missedCount}
              </Text>
            </View>
          </View>
        </View>

        <ActiveMedicationsList medications={dashboard.activeMedications} />
        <View className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}
