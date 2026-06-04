type NotificationsSummaryProps = {
  unreadCount: number;
  readRate: number;
  avgReadTimeLabel: string;
  totalNotifications: number;
};

export default function NotificationsSummary({
  unreadCount,
  readRate,
  avgReadTimeLabel,
  totalNotifications,
}: NotificationsSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Unread in view",
            value: unreadCount,
          },
          {
            label: "Read Rate",
            value: `${Math.round(readRate)}%`,
          },
          {
            label: "Avg. Read Time",
            value: avgReadTimeLabel,
          },
          {
            label: "Total Notifications",
            value: totalNotifications,
          },
        ].map((item) => (
          <article key={item.label} className="app-surface rounded-3xl p-5">
            <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
              {item.label}
            </p>
            <p className="app-text-primary mt-3 text-3xl font-bold">{item.value}</p>
          </article>
        ))}
      </div>

      <article className="app-surface rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="app-text-primary text-2xl font-bold">Read Progress</h3>
            <p className="app-text-secondary mt-2 text-sm">
              Based on your current notification history.
            </p>
          </div>
          <span className="app-text-primary text-3xl font-bold">
            {Math.round(readRate)}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[var(--brand-primary)] transition-all"
            style={{ width: `${Math.round(readRate)}%` }}
          />
        </div>
      </article>
    </>
  );
}
