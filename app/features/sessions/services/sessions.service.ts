import { axiosPrivate } from '@/shared/lib/axios';
import type {
  PatientSessionDetailsResponse,
  PatientSessionListItemResponse,
} from '@/features/sessions/types/sessions.types';

export function getPatientSessions(patientId: number) {
  return axiosPrivate.get<PatientSessionListItemResponse[], PatientSessionListItemResponse[]>(
    `/sessions/patient/${patientId}`,
  );
}

export function getPatientSessionDetails(patientId: number, sessionId: number) {
  return axiosPrivate.get<PatientSessionDetailsResponse, PatientSessionDetailsResponse>(
    `/patients/${patientId}/sessions/${sessionId}`,
  );
}
