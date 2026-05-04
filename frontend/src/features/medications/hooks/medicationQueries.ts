import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMedication,
  getMedications,
  getPatientMedications,
  getPatientMedication,
  addPatientMedication,
  updatePatientMedication,
  deletePatientMedication,
} from "@/features/medications/services";
import type {
  PatientMedicationMutationPayload,
  UpdatePatientMedicationFormValues,
} from "@/features/medications/schemas/medicationSchema";
import type { CreateMedicationPayload } from "@/features/medications/services";

export const medicationQueryKeys = {
  all: ["medications"] as const,
  catalog: ["medications", "catalog"] as const,
  patientList: (patientId: number) =>
    ["patients", patientId, "medications"] as const,
  detail: (patientId: number, medId: number) =>
    ["patients", patientId, "medications", medId] as const,
};

export function useMedications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: medicationQueryKeys.catalog,
    queryFn: () => getMedications(),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePatientMedications(patientId: number) {
  return useQuery({
    queryKey: medicationQueryKeys.patientList(patientId),
    queryFn: () => getPatientMedications(patientId),
    enabled: !!patientId,
  });
}

export function usePatientMedication(patientId: number, medId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: medicationQueryKeys.detail(patientId, medId),
    queryFn: () => getPatientMedication(patientId, medId),
    enabled: options?.enabled !== false && !!patientId && !!medId,
  });
}

export function useAddPatientMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      payload,
    }: {
      patientId: number;
      payload: PatientMedicationMutationPayload;
    }) =>
      addPatientMedication(patientId, payload),
    onSuccess: (_, { patientId }) => {
      void queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.patientList(patientId),
      });
    },
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMedicationPayload) => createMedication(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: medicationQueryKeys.catalog });
    },
  });
}

export function useUpdatePatientMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      medId,
      payload,
    }: {
      patientId: number;
      medId: number;
      payload: UpdatePatientMedicationFormValues;
    }) => updatePatientMedication(patientId, medId, payload),
    onSuccess: (_, { patientId, medId }) => {
      void queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.patientList(patientId),
      });
      void queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.detail(patientId, medId),
      });
    },
  });
}

export function useDeletePatientMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, medId }: { patientId: number; medId: number }) =>
      deletePatientMedication(patientId, medId),
    onSuccess: (_, { patientId }) => {
      void queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.patientList(patientId),
      });
    },
  });
}
