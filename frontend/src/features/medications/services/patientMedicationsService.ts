import { axiosPrivate } from "@/shared/lib/axios";
import type { AddPatientMedicationFormValues, UpdatePatientMedicationFormValues } from "../schemas/medicationSchema";

export interface PatientMedication {
  id: number;
  patientId: number;
  medicationId: number;
  dosage?: string;
  frequency?: string;
  instruction?: string;
  startDate: string;
  endDate?: string;
  status: "active" | "discontinued";
}

export function getPatientMedications(patientId: number) {
  return axiosPrivate.get<PatientMedication[]>(`/patients/${patientId}/medications`);
}

export function getPatientMedication(patientId: number, medId: number) {
  return axiosPrivate.get<PatientMedication>(`/patients/${patientId}/medications/${medId}`);
}

export function addPatientMedication(patientId: number, payload: AddPatientMedicationFormValues) {
  return axiosPrivate.post<PatientMedication>(`/patients/${patientId}/medications`, payload);
}

export function updatePatientMedication(
  patientId: number,
  medId: number,
  payload: UpdatePatientMedicationFormValues
) {
  return axiosPrivate.patch<PatientMedication>(`/patients/${patientId}/medications/${medId}`, payload);
}

export function deletePatientMedication(patientId: number, medId: number) {
  return axiosPrivate.delete(`/patients/${patientId}/medications/${medId}`);
}
