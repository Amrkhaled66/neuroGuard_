type OverviewStatsGridProps = {
  totalSeizures?: number;
  activeMedications?: number;
  unreadNotifications?: number;
  analyzedSessions?: number;
};

export default function OverviewStatsGrid({
  totalSeizures,
  activeMedications,
  unreadNotifications,
  analyzedSessions,
}: OverviewStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        {
          label: "Total Seizures",
          value: totalSeizures ?? "--",
          note: "Recent analyzed sessions",
        },
        {
          label: "Active Medications",
          value: activeMedications ?? "--",
          note: "Current treatment plan",
        },
        {
          label: "Unread Alerts",
          value: unreadNotifications ?? "--",
          note: "Messages awaiting review",
        },
        {
          label: "Analyzed Sessions",
          value: analyzedSessions ?? "--",
          note: "EEG sessions with results",
        },
      ].map((item) => (
        <article key={item.label} className="app-surface rounded-3xl p-5">
          <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
            {item.label}
          </p>
          <p className="app-text-primary mt-3 text-3xl font-bold">{item.value}</p>
          <p className="app-text-secondary mt-2 text-sm">{item.note}</p>
        </article>
      ))}
    </div>
  );
}
