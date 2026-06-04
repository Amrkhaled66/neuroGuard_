type CommunicationHealthCardProps = {
  avgResponseTimeInSeconds: number | null;
  patientResponseRate: number;
  totalNotifications: number;
};

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

export default function CommunicationHealthCard({
  avgResponseTimeInSeconds,
  patientResponseRate,
  totalNotifications,
}: CommunicationHealthCardProps) {
  const statCards = [
    {
      label: "Patient Response Rate",
      value: `${Math.round(patientResponseRate)}%`,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Avg. Response Time",
      value: formatResponseTime(avgResponseTimeInSeconds),
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Total Notifications",
      value: totalNotifications.toString(),
      tone: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <aside className="app-surface rounded-3xl p-6">
      <h3 className="app-text-primary text-xl font-bold tracking-[0.08em] uppercase">
        Communication Health
      </h3>

      <div className="mt-6 space-y-4">
        {statCards.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200/70 p-4"
          >
            <p className="text-fontColor text-sm font-semibold tracking-[0.08em] uppercase">
              {metric.label}
            </p>
            <div
              className={`mt-3 inline-flex rounded-full px-3 py-2 text-lg font-bold ${metric.tone}`}
            >
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
