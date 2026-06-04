import { axiosPrivate } from "@/shared/lib/axios";
import type {
  PatientMedicationMutationPayload,
  UpdatePatientMedicationFormValues,
} from "../schemas/medicationSchema";

export interface PatientMedication {
  id: number;
  patientId: number;
  medicationId: number;
  name?: string;
  form?: "tablet" | "capsule" | "liquid" | "injection" | "other";
  dosage?: string;
  frequency?: string;
  instruction?: string;
  startDate: string;
  endDate?: string;
  status: "active" | "discontinued";
  recentLogs?: MedicationLogItem[];
  adherence?: {
    takenCount: number;
    missedCount: number;
    scheduledCount: number;
    adherenceRate: number;
  };
}

export interface MedicationLogItem {
  id: number;
  status: "scheduled" | "taken" | "missed";
  takenAt: string | null;
}

export interface PatientMedicationAdherenceResponse {
  summary: {
    totalMedications: number;
    activeMedications: number;
    takenCount: number;
    missedCount: number;
    scheduledCount: number;
    adherenceRate: number;
  };
  trend: Array<{
    date: string;
    taken: number;
    missed: number;
  }>;
  items: PatientMedication[];
}

export function getPatientMedications(patientId: number) {
  return axiosPrivate.get<PatientMedication[], PatientMedication[]>(
    `/patients/${patientId}/medications`,
  );
}

export function getPatientMedicationAdherence(
  patientId: number,
  days = 7,
) {
  return axiosPrivate.get<
    PatientMedicationAdherenceResponse,
    PatientMedicationAdherenceResponse
  >(`/patients/${patientId}/medications/adherence`, {
    params: { days },
  });
}

export function getPatientMedication(patientId: number, medId: number) {
  return axiosPrivate.get<PatientMedication, PatientMedication>(
    `/patients/${patientId}/medications/${medId}`,
  );
}

export function addPatientMedication(
  patientId: number,
  payload: PatientMedicationMutationPayload,
) {
  return axiosPrivate.post<PatientMedication, PatientMedication>(
    `/patients/${patientId}/medications`,
    payload,
  );
}

export function updatePatientMedication(
  patientId: number,
  medId: number,
  payload: UpdatePatientMedicationFormValues
) {
  return axiosPrivate.patch<PatientMedication, PatientMedication>(
    `/patients/${patientId}/medications/${medId}`,
    payload,
  );
}

export function deletePatientMedication(patientId: number, medId: number) {
  return axiosPrivate.delete(`/patients/${patientId}/medications/${medId}`);
}

export function createMedicationLog(
  patientId: number,
  medId: number,
  status: MedicationLogItem["status"],
) {
  return axiosPrivate.post<MedicationLogItem, MedicationLogItem>(
    `/patients/${patientId}/medications/${medId}/logs`,
    {
      status,
      takenAt: new Date().toISOString(),
    },
  );
}
