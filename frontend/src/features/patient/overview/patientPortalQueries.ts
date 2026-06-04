import { useQuery } from "@tanstack/react-query";
import { getPatientOverview } from "./patientOverviewService";

export const patientPortalQueryKeys = {
  overview: ["patient", "overview"] as const,
};

export function usePatientOverview() {
  return useQuery({
    queryKey: patientPortalQueryKeys.overview,
    queryFn: () => getPatientOverview(),
  });
}
