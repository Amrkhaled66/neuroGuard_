import { memo } from "react";
import Button from "@/shared/ui/Button";
import NotificationCard from "./NotificationCard";
import type { NotificationItem, NotificationPagination } from "../types";

type CommunicationLogProps = {
  items: NotificationItem[];
  isLoading?: boolean;
  errorMessage?: string | null;
  pagination?: NotificationPagination | null;
  onPageChange?: (page: number) => void;
  canToggleReadStatus?: boolean;
  updatingNotificationId?: number | null;
  onToggleReadStatus?: (item: NotificationItem) => void;
};

function CommunicationLog({
  items,
  isLoading = false,
  errorMessage,
  pagination,
  onPageChange,
  canToggleReadStatus = false,
  updatingNotificationId = null,
  onToggleReadStatus,
}: CommunicationLogProps) {
  const hasPagination = !!pagination && pagination.totalPages > 1;

  return (
    <section>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="app-surface animate-pulse rounded-3xl p-5"
            >
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-2xl bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-4/5 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))
        ) : errorMessage ? (
          <div className="app-surface rounded-3xl p-6 text-red-600">
            {errorMessage}
          </div>
        ) : items.length === 0 ? (
          <div className="app-surface rounded-3xl p-6 text-sm text-slate-500">
            No notifications yet for this patient.
          </div>
        ) : (
          items.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              canToggleReadStatus={canToggleReadStatus}
              isUpdating={updatingNotificationId === item.id}
              onToggleReadStatus={onToggleReadStatus}
            />
          ))
        )}
      </div>

      {hasPagination && pagination && onPageChange ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-fontColor text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default memo(CommunicationLog);
