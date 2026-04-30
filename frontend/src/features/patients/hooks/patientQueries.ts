import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  type CreatePatientPayload,
} from "@/features/patients/services";

export const patientQueryKeys = {
  all: ["patients"] as const,
  lists: ["patients", "list"] as const,
};

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patients", "create"] as const,
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientQueryKeys.all });
    },
  });
}
