import { useMemo, useState } from "react";
import { CommunicationLog, usePatientNotifications, useUpdatePatientNotificationReadStatus } from "@/features/doctor/patients/notifications";
import type { NotificationItem } from "@/features/doctor/patients/notifications";
import { useAuth } from "@/features/auth/context/useAuth";
import { Alert } from "@/shared/utils/alert";
import NotificationsSummary from "./components/NotificationsSummary";

const PAGE_SIZE = 10;

function formatResponseTime(seconds: number | null) {
  if (seconds === null) {
    return "No reads yet";
  }

  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  }

  if (seconds < 3600) {
    return `${Math.round(seconds / 60)} min`;
  }

  if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} hr`;
  }

  return `${Math.round(seconds / 86400)} d`;
}

export default function PatientNotificationsView() {
  const { authData } = useAuth();
  const patientId = Number(authData.user?.id ?? 0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const notificationsQuery = usePatientNotifications(patientId, {
    page,
    limit: PAGE_SIZE,
  });
  const updateMutation = useUpdatePatientNotificationReadStatus();

  const items = notificationsQuery.data?.items ?? [];
  const filteredItems = useMemo(() => {
    if (filter === "all") {
      return items;
    }

    return items.filter((item) => (filter === "read" ? item.isRead : !item.isRead));
  }, [filter, items]);

  const unreadCount = items.filter((item) => !item.isRead).length;
  const stats = notificationsQuery.data?.stats ?? {
    avgResponseTimeInSeconds: null,
    patientResponseRate: 0,
  };

  if (!patientId) {
    return (
      <section className="app-surface rounded-3xl p-6 text-red-600">
        Session invalid. Please sign in again.
      </section>
    );
  }

  const handleToggleReadStatus = async (item: NotificationItem) => {
    try {
      await updateMutation.mutateAsync({
        patientId,
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
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
            Notifications
          </p>
          <h2 className="app-text-primary mt-2 text-3xl font-bold">
            Messages from your care team
          </h2>
          <p className="app-text-secondary mt-2 text-sm">
            Review updates, reminders, and mark messages as read when you have seen them.
          </p>
        </div>

        <div className="flex gap-2 rounded-full bg-[var(--surface-muted)]/75 p-1">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "read", label: "Read" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === item.key
                  ? "bg-white text-[var(--brand-primary)] shadow-sm"
                  : "app-text-secondary"
              }`}
              onClick={() => setFilter(item.key as "all" | "unread" | "read")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <NotificationsSummary
        unreadCount={unreadCount}
        readRate={stats.patientResponseRate}
        avgReadTimeLabel={formatResponseTime(stats.avgResponseTimeInSeconds)}
        totalNotifications={notificationsQuery.data?.pagination.total ?? 0}
      />

      <CommunicationLog
        items={filteredItems}
        isLoading={notificationsQuery.isLoading}
        errorMessage={
          notificationsQuery.error
            ? notificationsQuery.error.message || "Failed to load notifications."
            : null
        }
        pagination={notificationsQuery.data?.pagination ?? null}
        canToggleReadStatus
        updatingNotificationId={
          updateMutation.isPending
            ? (updateMutation.variables?.notificationId ?? null)
            : null
        }
        onPageChange={setPage}
        onToggleReadStatus={(item) => void handleToggleReadStatus(item)}
      />
    </section>
  );
}
