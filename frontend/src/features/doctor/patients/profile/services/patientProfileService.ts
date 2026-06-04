import { axiosPrivate } from "@/shared/lib/axios";
import type { PatientStatus } from "@/shared/interfaces/PatientStatus";
import type {
  AlertItem,
  ClinicalItem,
  MedicationItem,
  StatItem,
} from "@/features/doctor/patients/profile";

export type PatientProfilePatient = {
  id: number;
  firstName: string;
  lastName: string;
  initials: string;
  medicalId: string;
  birthDate: string;
  age: number;
  gender: "male" | "female";
  physician: string;
  admissionDate: string | null;
  status: PatientStatus;
};

export type PatientProfileResponse = {
  patient: PatientProfilePatient;
  clinicalOverview: ClinicalItem[];
  medications: MedicationItem[];
  risk: {
    score: number;
    label: string;
    description: string;
  };
  alerts: AlertItem[];
  stats: StatItem[];
  trend?: unknown;
};

export function getPatientProfile(patientId: number) {
  return axiosPrivate.get<PatientProfileResponse, PatientProfileResponse>(
    `/patients/${patientId}/profile`,
  );
}
