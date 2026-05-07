import { axiosPrivate } from "@/shared/lib/axios";
import type { CreateNotificationPayload } from "../schemas/notificationSchema";
import type {
  NotificationItem,
  PatientNotificationsResponse,
} from "../types";

export interface NotificationListParams {
  page?: number;
  limit?: number;
}

export function getPatientNotifications(
  patientId: number,
  params: NotificationListParams = {},
) {
  return axiosPrivate.get<
    PatientNotificationsResponse,
    PatientNotificationsResponse
  >(`/patients/${patientId}/notifications`, {
    params,
  });
}

export function createPatientNotification(
  patientId: number,
  payload: CreateNotificationPayload,
) {
  return axiosPrivate.post<NotificationItem, NotificationItem>(
    `/patients/${patientId}/notifications`,
    payload,
  );
}

export function updatePatientNotificationReadStatus(
  patientId: number,
  notificationId: number,
  isRead: boolean,
) {
  return axiosPrivate.patch<NotificationItem, NotificationItem>(
    `/patients/${patientId}/notifications/${notificationId}/read-status`,
    { isRead },
  );
}
