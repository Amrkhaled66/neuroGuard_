type RecentAlert = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
};

type OverviewAlertsCardProps = {
  alerts: RecentAlert[];
};

export default function OverviewAlertsCard({ alerts }: OverviewAlertsCardProps) {
  return (
    <article className="app-surface rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
            Recent Alerts
          </p>
          <h3 className="app-text-primary mt-2 text-2xl font-bold">
            Messages from your care team
          </h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {alerts.length ? (
          alerts.map((alert) => (
            <article
              key={alert.id}
              className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="app-text-primary text-sm font-semibold">{alert.title}</p>
                  <p className="app-text-secondary mt-2 text-sm leading-6">{alert.message}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    alert.isRead ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {alert.isRead ? "Read" : "Unread"}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl bg-[var(--surface-muted)]/55 p-4 text-sm app-text-secondary">
            No alerts yet. Your care team messages will appear here.
          </div>
        )}
      </div>
    </article>
  );
}
