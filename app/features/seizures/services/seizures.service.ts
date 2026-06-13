import { axiosPrivate } from '@/shared/lib/axios';
import type {
  SeizureAnalyticsResponse,
  SeizureRange,
} from '@/features/seizures/types/seizures.types';

export function getPatientSeizureAnalytics(
  patientId: number,
  days: SeizureRange,
  page = 1,
  limit = 10,
) {
  return axiosPrivate.get<SeizureAnalyticsResponse, SeizureAnalyticsResponse>(
    `/patients/${patientId}/seizures/analytics?days=${days}&page=${page}&limit=${limit}`,
  );
}
