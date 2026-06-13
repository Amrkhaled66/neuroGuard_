import { axiosPrivate } from '@/shared/lib/axios';
import type { AlertNotification, AlertsResponse } from '@/features/alerts/types/alerts.types';

export function getPatientNotifications(patientId: number, page: number, limit: number) {
  return axiosPrivate.get<AlertsResponse, AlertsResponse>(
    `/patients/${patientId}/notifications?page=${page}&limit=${limit}`,
  );
}

export function updateNotificationReadStatus(
  patientId: number,
  notificationId: number,
  isRead: boolean,
) {
  return axiosPrivate.patch<AlertNotification, AlertNotification>(
    `/patients/${patientId}/notifications/${notificationId}/read-status`,
    { isRead },
  );
}
