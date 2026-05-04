import { axiosPrivate } from "@/shared/lib/axios";
import type { MedicationForm } from "../schemas/medicationSchema";

export interface Medication {
  id: number;
  name: string;
  form: MedicationForm;
  doctorId: number;
}

export type CreateMedicationPayload = {
  name: string;
  form: MedicationForm;
};

export function getMedications() {
  return axiosPrivate.get<Medication[], Medication[]>("/medications");
}

export function createMedication(payload: CreateMedicationPayload) {
  return axiosPrivate.post<Medication, Medication>("/medications", payload);
}
