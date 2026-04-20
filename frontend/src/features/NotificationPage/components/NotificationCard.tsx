import type { NotificationItem } from "../types";

type NotificationCardProps = {
  item: NotificationItem;
};

const statusStyles: Record<NotificationItem["status"], string> = {
  read: "bg-[color:rgba(15,23,42,0.06)] text-fontColor",
  sent: "bg-[color:rgba(16,185,129,0.10)] text-status-success",
  unread: "bg-[color:rgba(244,163,0,0.12)] text-status-warning",
};

export default function NotificationCard({ item }: NotificationCardProps) {
  return (
    <article className="rounded-3xl bg-(--surface-raised) p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            item.status === "read"
              ? "bg-brand-primary-soft"
              : "bg-status-danger-soft"
          } `}
        ></div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="app-text-primary text-2xl leading-tight font-bold">
                {item.title}
              </h4>
              <p className="text-fontColor mt-1 text-sm">{item.data}</p>
            </div>

            <span
              className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase ${statusStyles[item.status]}`}
            >
              {item.status}
            </span>
          </div>

          <p className="text-fontColor mt-4 text-[15px] leading-7">
            {item.message}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,107,74,0.10)] text-xs font-bold text-brand-primary">
              {item.source.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-(--app-text-primary)">
              {item.source}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
