import { useQuery } from "@tanstack/react-query";
import { getPatientProfile } from "../services";

export const patientProfileQueryKeys = {
  detail: (patientId: number) => ["patients", patientId, "profile"] as const,
};

export function usePatientProfile(patientId: number) {
  return useQuery({
    queryKey: patientProfileQueryKeys.detail(patientId),
    queryFn: () => getPatientProfile(patientId),
    enabled: !!patientId,
  });
}
