import { memo } from "react";
import Button from "@/shared/ui/Button";
import type { NotificationItem } from "../types";

type NotificationCardProps = {
  item: NotificationItem;
  canToggleReadStatus?: boolean;
  isUpdating?: boolean;
  onToggleReadStatus?: (item: NotificationItem) => void;
};

const statusStyles = {
  read: "bg-emerald-100 text-emerald-700",
  unread: "bg-amber-100 text-amber-700",
};

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function NotificationCard({
  item,
  canToggleReadStatus = false,
  isUpdating = false,
  onToggleReadStatus,
}: NotificationCardProps) {
  const status = item.isRead ? "read" : "unread";

  return (
    <article className="app-surface rounded-3xl p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            item.isRead ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          <span
            className={`h-3 w-3 rounded-full ${
              item.isRead ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="app-text-primary text-2xl leading-tight font-bold">
                {item.title}
              </h4>
              <p className="text-fontColor mt-1 text-sm">
                Sent {formatDate(item.createdAt)}
              </p>
            </div>

            <span
              className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase ${statusStyles[status]}`}
            >
              {status}
            </span>
          </div>

          <p className="text-fontColor mt-4 text-[15px] leading-7">
            {item.message}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-fontColor text-sm">
              {item.readAt
                ? `Read ${formatDate(item.readAt)}`
                : "Waiting for patient response"}
            </div>

            {canToggleReadStatus && onToggleReadStatus ? (
              <Button
                variant={item.isRead ? "outline" : "warning"}
                className="px-3 py-2 text-sm"
                isLoading={isUpdating}
                onClick={() => onToggleReadStatus(item)}
              >
                {item.isRead ? "Mark as unread" : "Mark as read"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(NotificationCard);
