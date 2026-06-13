import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { ActiveMedicationsList } from '@/features/medication/components/ActiveMedicationsList';
import { MedicationAdherenceInsightsCard } from '@/features/medication/components/MedicationAdherenceInsightsCard';
import { MedicationDetailsSheet } from '@/features/medication/components/MedicationDetailsSheet';
import { MedicationHeader } from '@/features/medication/components/MedicationHeader';
import { NextDoseCard } from '@/features/medication/components/NextDoseCard';
import { TodayMedicationSummaryCard } from '@/features/medication/components/TodayMedicationSummaryCard';
import { TodayScheduleList } from '@/features/medication/components/TodayScheduleList';
import { useMedicationDashboard } from '@/features/medication/hooks/useMedicationDashboard';
import type { ActiveMedicationCardItem } from '@/features/medication/types/medication.types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MedicationScreen() {
  const [selectedMedication, setSelectedMedication] = useState<ActiveMedicationCardItem | null>(null);
  const {
    dashboard,
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
        <MedicationAdherenceInsightsCard
          summary={dashboard.adherenceSummary}
          trend={dashboard.adherenceTrend ?? []}
        />
        <ActiveMedicationsList
          medications={dashboard.activeMedications}
          onSelectMedication={setSelectedMedication}
        />
        <View className="h-2" />
      </ScrollView>
      <MedicationDetailsSheet
        medication={selectedMedication}
        onClose={() => setSelectedMedication(null)}
      />
    </SafeAreaView>
  );
}
