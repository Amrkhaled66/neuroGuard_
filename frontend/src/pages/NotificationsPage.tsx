import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth";
import AddNotificationModal from "@features/NotificationPage/components/AddNotificationModal";
import CommunicationHealthCard from "@features/NotificationPage/components/CommunicationHealthCard";
import CommunicationLog from "@features/NotificationPage/components/CommunicationLog";
import {
  usePatientNotifications,
  useUpdatePatientNotificationReadStatus,
} from "@features/NotificationPage/hooks";
import type { NotificationItem } from "@features/NotificationPage/types";
import { USER_ROLES } from "@/shared/interfaces/IUser";
import Button from "@/shared/ui/Button";
import { Alert } from "@/shared/utils/alert";

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { authData } = useAuth();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const parsedPatientId = Number.parseInt(patientId || "0", 10);
  const currentUserRole = authData.user?.role;
  const canCreateNotifications = currentUserRole === USER_ROLES.DOCTOR;
  const canToggleReadStatus = currentUserRole === USER_ROLES.PATIENT;

  const notificationsQuery = usePatientNotifications(parsedPatientId, {
    page,
    limit: PAGE_SIZE,
  });
  const updateReadStatusMutation = useUpdatePatientNotificationReadStatus();

  const items = notificationsQuery.data?.items ?? [];
  const pagination = notificationsQuery.data?.pagination ?? null;
  const stats = notificationsQuery.data?.stats ?? {
    avgResponseTimeInSeconds: null,
    patientResponseRate: 0,
  };

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleCreated = useCallback(() => {
    setPage(1);
  }, []);

  const handleToggleReadStatus = useCallback(
    async (item: NotificationItem) => {
      try {
        await updateReadStatusMutation.mutateAsync({
          patientId: parsedPatientId,
          notificationId: item.id,
          isRead: !item.isRead,
        });
      } catch (error) {
        Alert({
          title: "Unable to update notification",
          text:
            error instanceof Error
              ? error.message
              : "Something went wrong while updating the notification status.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    [parsedPatientId, updateReadStatusMutation],
  );

  const errorMessage = notificationsQuery.error
    ? notificationsQuery.error.message || "Failed to load notifications."
    : null;

  if (!parsedPatientId) {
    return (
      <section className="min-h-screen">
        <div className="app-surface rounded-3xl p-6 text-red-600">
          Invalid patient id.
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">Patient Notifications</p>
          {canCreateNotifications ? (
            <Button className="px-4 py-3" onClick={openCreateModal}>
              Add New Notification
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.85fr)]">
          <div className="min-w-0">
            <CommunicationLog
              items={items}
              isLoading={notificationsQuery.isLoading}
              errorMessage={errorMessage}
              pagination={pagination}
              canToggleReadStatus={canToggleReadStatus}
              updatingNotificationId={
                updateReadStatusMutation.isPending
                  ? (updateReadStatusMutation.variables?.notificationId ?? null)
                  : null
              }
              onPageChange={handlePageChange}
              onToggleReadStatus={handleToggleReadStatus}
            />
          </div>

          <div className="min-w-0">
            <CommunicationHealthCard
              avgResponseTimeInSeconds={stats.avgResponseTimeInSeconds}
              patientResponseRate={stats.patientResponseRate}
              totalNotifications={pagination?.total ?? 0}
            />
          </div>
        </div>

        {canCreateNotifications ? (
          <AddNotificationModal
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            patientId={parsedPatientId}
            onCreated={handleCreated}
          />
        ) : null}
      </div>
    </section>
  );
}
