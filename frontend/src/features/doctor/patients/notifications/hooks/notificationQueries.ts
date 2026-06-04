import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPatientNotification,
  getPatientNotifications,
  updatePatientNotificationReadStatus,
  type NotificationListParams,
} from "../services";
import type { CreateNotificationPayload } from "../schemas/notificationSchema";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  patientList: (patientId: number, page: number, limit: number) =>
    ["patients", patientId, "notifications", page, limit] as const,
  patientLists: (patientId: number) =>
    ["patients", patientId, "notifications"] as const,
};

export function usePatientNotifications(
  patientId: number,
  params: Required<NotificationListParams>,
) {
  return useQuery({
    queryKey: notificationQueryKeys.patientList(
      patientId,
      params.page,
      params.limit,
    ),
    queryFn: () => getPatientNotifications(patientId, params),
    enabled: !!patientId,
  });
}

export function useCreatePatientNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      payload,
    }: {
      patientId: number;
      payload: CreateNotificationPayload;
    }) => createPatientNotification(patientId, payload),
    onSuccess: (_, { patientId }) => {
      void queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.patientLists(patientId),
      });
    },
  });
}

export function useUpdatePatientNotificationReadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      patientId,
      notificationId,
      isRead,
    }: {
      patientId: number;
      notificationId: number;
      isRead: boolean;
    }) =>
      updatePatientNotificationReadStatus(patientId, notificationId, isRead),
    onSuccess: (_, { patientId }) => {
      void queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.patientLists(patientId),
      });
    },
  });
}
