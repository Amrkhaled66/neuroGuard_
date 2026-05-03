import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedications,
  getPatientMedications,
  getPatientMedication,
  addPatientMedication,
  updatePatientMedication,
  deletePatientMedication,
} from "@/features/medications/services";
import type {
  AddPatientMedicationFormValues,
  UpdatePatientMedicationFormValues,
} from "@/features/medications/schemas/medicationSchema";

export const medicationQueryKeys = {
  all: ["medications"] as const,
  lists: ["medications", "list"] as const,
  list: (patientId: number) => ["medications", "list", patientId] as const,
  detail: (patientId: number, medId: number) => ["medications", patientId, medId] as const,
};

export function useMedications() {
  return useQuery({
    queryKey: medicationQueryKeys.lists,
    queryFn: () => getMedications(),
  });
}

export function usePatientMedications(patientId: number) {
  return useQuery({
    queryKey: medicationQueryKeys.list(patientId),
    queryFn: () => getPatientMedications(patientId),
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
    mutationFn: ({ patientId, payload }: { patientId: number; payload: AddPatientMedicationFormValues }) =>
      addPatientMedication(patientId, payload),
    onSuccess: (_, { patientId }) => {
      void queryClient.invalidateQueries({ queryKey: medicationQueryKeys.list(patientId) });
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
      void queryClient.invalidateQueries({ queryKey: medicationQueryKeys.list(patientId) });
      void queryClient.invalidateQueries({ queryKey: medicationQueryKeys.detail(patientId, medId) });
    },
  });
}

export function useDeletePatientMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, medId }: { patientId: number; medId: number }) =>
      deletePatientMedication(patientId, medId),
    onSuccess: (_, { patientId }) => {
      void queryClient.invalidateQueries({ queryKey: medicationQueryKeys.list(patientId) });
    },
  });
}
