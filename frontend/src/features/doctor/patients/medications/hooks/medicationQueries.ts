import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMedication,
  getMedications,
  getPatientMedications,
  getPatientMedicationAdherence,
  getPatientMedication,
  addPatientMedication,
  updatePatientMedication,
  deletePatientMedication,
  createMedicationLog,
} from "../services";
import type {
  PatientMedicationMutationPayload,
  UpdatePatientMedicationFormValues,
} from "../schemas/medicationSchema";
import type { CreateMedicationPayload } from "../services";

export const medicationQueryKeys = {
  all: ["medications"] as const,
  catalog: ["medications", "catalog"] as const,
  patientList: (patientId: number) =>
    ["patients", patientId, "medications"] as const,
  adherence: (patientId: number, days: number) =>
    ["patients", patientId, "medications", "adherence", days] as const,
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

export function usePatientMedicationAdherence(patientId: number, days: number) {
  return useQuery({
    queryKey: medicationQueryKeys.adherence(patientId, days),
    queryFn: () => getPatientMedicationAdherence(patientId, days),
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

export function useCreateMedicationLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      medId,
      status,
    }: {
      patientId: number;
      medId: number;
      status: "scheduled" | "taken" | "missed";
    }) => createMedicationLog(patientId, medId, status),
    onSuccess: (_, { patientId }) => {
      void queryClient.invalidateQueries({
        queryKey: medicationQueryKeys.patientList(patientId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["patients", patientId, "medications"],
      });
    },
  });
}
