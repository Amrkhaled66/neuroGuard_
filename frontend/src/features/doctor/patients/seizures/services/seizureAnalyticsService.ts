import { axiosPrivate } from "@/shared/lib/axios";
import type { SeizureAnalyticsResponse } from "../types";

export type SeizureAnalyticsParams = {
  days?: number;
  page?: number;
  limit?: number;
};

export function getPatientSeizureAnalytics(
  patientId: number,
  params: SeizureAnalyticsParams = {},
) {
  return axiosPrivate.get<SeizureAnalyticsResponse, SeizureAnalyticsResponse>(
    `/patients/${patientId}/seizures/analytics`,
    {
      params,
    },
  );
}
