import { axiosPrivate } from '@/shared/lib/axios';
import type {
  MedicationAdherenceResponse,
  MedicationLogStatus,
  PatientMedication,
} from '@/features/medication/types/medication.types';

export function getPatientMedicationAdherence(patientId: number, days: 7 | 30) {
  return axiosPrivate.get<MedicationAdherenceResponse, MedicationAdherenceResponse>(
    `/patients/${patientId}/medications/adherence?days=${days}`,
  );
}

export function getPatientMedications(patientId: number) {
  return axiosPrivate.get<PatientMedication[], PatientMedication[]>(
    `/patients/${patientId}/medications`,
  );
}

export function createMedicationLog(
  patientId: number,
  medId: number,
  status: Extract<MedicationLogStatus, 'taken' | 'missed'>,
  takenAt = new Date().toISOString(),
) {
  return axiosPrivate.post(`/patients/${patientId}/medications/${medId}/logs`, {
    status,
    takenAt,
  });
}
