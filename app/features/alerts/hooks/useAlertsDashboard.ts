import { useCallback, useMemo, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/useAuth';
import {
  getPatientNotifications,
  updateNotificationReadStatus,
} from '@/features/alerts/services/alerts.service';
import type {
  AlertListItem,
  AlertNotification,
  AlertsDashboard,
  AlertsResponse,
} from '@/features/alerts/types/alerts.types';

const PAGE_SIZE = 12;

export const alertsQueryKeys = {
  notifications: (patientId: number) => ['patient', patientId, 'notifications'] as const,
};

function formatRelativeOrAbsoluteDate(value: string | null) {
  if (!value) {
    return 'Unknown time';
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const absMinutes = Math.abs(diffMinutes);

  if (absMinutes < 60) {
    if (absMinutes <= 1) {
      return 'Just now';
    }

    return `${absMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  const absHours = Math.abs(diffHours);
  if (absHours < 24) {
    return `${absHours} hour${absHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) === 1) {
    return 'Yesterday';
  }

  if (Math.abs(diffDays) < 7) {
    return `${Math.abs(diffDays)} days ago`;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()] ?? 'Jan';
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

function toPreview(message: string) {
  const normalized = message.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 96) {
    return normalized;
  }

  return `${normalized.slice(0, 93).trimEnd()}...`;
}

function mapItems(pages: AlertsResponse[]): AlertListItem[] {
  return pages.flatMap((page) =>
    page.items.map((item) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      preview: toPreview(item.message),
      isRead: item.isRead,
      createdAt: item.createdAt,
      readAt: item.readAt,
      timestampLabel: formatRelativeOrAbsoluteDate(item.createdAt),
    })),
  );
}

function mapDashboard(pages: AlertsResponse[]): AlertsDashboard {
  const totalCount = pages[0]?.pagination.total ?? 0;
  const items = mapItems(pages);
  const unreadCount = items.filter((item) => !item.isRead).length;

  return {
    unreadCount,
    totalCount,
    items,
    stats: pages[0]?.stats ?? {
      avgResponseTimeInSeconds: null,
      patientResponseRate: 0,
    },
  };
}

function patchNotificationInPages(
  pages: AlertsResponse[],
  notificationId: number,
  updater: (item: AlertNotification) => AlertNotification,
) {
  return pages.map((page) => ({
    ...page,
    items: page.items.map((item) => (item.id === notificationId ? updater(item) : item)),
  }));
}

type UseAlertsDashboardResult = {
  dashboard: AlertsDashboard | null;
  selectedAlert: AlertListItem | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  openAlert: (alert: AlertListItem) => Promise<void>;
  closeAlert: () => void;
  loadMore: () => Promise<void>;
  refetchAll: () => Promise<void>;
};

export function useAlertsDashboard(): UseAlertsDashboardResult {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<AlertListItem | null>(null);
  const patientId = Number(session?.user.id ?? 0);
  const hasPatientId = Number.isFinite(patientId) && patientId > 0;

  const notificationsQuery = useInfiniteQuery({
    queryKey: alertsQueryKeys.notifications(patientId),
    queryFn: ({ pageParam = 1 }) => getPatientNotifications(patientId, pageParam, PAGE_SIZE),
    enabled: hasPatientId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      updateNotificationReadStatus(patientId, notificationId, true),
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData(
        alertsQueryKeys.notifications(patientId),
        (current:
          | {
              pages: AlertsResponse[];
              pageParams: number[];
            }
          | undefined) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            pages: patchNotificationInPages(current.pages, updatedNotification.id, () => ({
              ...updatedNotification,
            })),
          };
        },
      );

      setSelectedAlert((current) =>
        current && current.id === updatedNotification.id
          ? {
              ...current,
              isRead: true,
              readAt: updatedNotification.readAt,
            }
          : current,
      );
    },
  });

  const dashboard = useMemo(() => {
    if (!notificationsQuery.data?.pages.length) {
      return null;
    }

    return mapDashboard(notificationsQuery.data.pages);
  }, [notificationsQuery.data]);

  const openAlert = useCallback(
    async (alert: AlertListItem) => {
      setSelectedAlert(alert);

      if (!alert.isRead) {
        await markAsReadMutation.mutateAsync(alert.id);
      }
    },
    [markAsReadMutation],
  );

  const closeAlert = useCallback(() => {
    setSelectedAlert(null);
  }, []);

  const loadMore = useCallback(async () => {
    if (!notificationsQuery.hasNextPage || notificationsQuery.isFetchingNextPage) {
      return;
    }

    await notificationsQuery.fetchNextPage();
  }, [notificationsQuery]);

  const refetchAll = useCallback(async () => {
    await notificationsQuery.refetch();
  }, [notificationsQuery]);

  return {
    dashboard,
    selectedAlert,
    isLoading: notificationsQuery.isLoading || (!hasPatientId && !notificationsQuery.data),
    isError: !hasPatientId || notificationsQuery.isError,
    error: !hasPatientId
      ? new Error('Patient session is unavailable.')
      : notificationsQuery.error ?? null,
    isLoadingMore: notificationsQuery.isFetchingNextPage,
    hasNextPage: notificationsQuery.hasNextPage ?? false,
    openAlert,
    closeAlert,
    loadMore,
    refetchAll,
  };
}
