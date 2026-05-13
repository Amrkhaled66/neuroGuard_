import { useQuery } from "@tanstack/react-query";
import {
  getPatientSeizureAnalytics,
  type SeizureAnalyticsParams,
} from "../services";

export const seizureAnalyticsQueryKeys = {
  patient: (
    patientId: number,
    days: number,
    page: number,
    limit: number,
  ) => ["patients", patientId, "seizures", "analytics", days, page, limit] as const,
};

export function usePatientSeizureAnalytics(
  patientId: number,
  params: Required<SeizureAnalyticsParams>,
) {
  return useQuery({
    queryKey: seizureAnalyticsQueryKeys.patient(
      patientId,
      params.days,
      params.page,
      params.limit,
    ),
    queryFn: () => getPatientSeizureAnalytics(patientId, params),
    enabled: !!patientId,
  });
}
