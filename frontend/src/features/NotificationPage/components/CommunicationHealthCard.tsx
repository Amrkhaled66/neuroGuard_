import type { HealthMetric } from "../types"

type CommunicationHealthCardProps = {
  metrics: HealthMetric[];
};

export default function CommunicationHealthCard({
  metrics,
}: CommunicationHealthCardProps) {
  return (
    <aside className="app-surface rounded-3xl p-6">
      <h3 className="app-text-primary text-xl font-bold tracking-[0.08em] uppercase">
        Communication Health
      </h3>

      <div className="mt-6 space-y-6">
        {metrics.map((metric) => (
          <div key={metric.id}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold tracking-[0.08em] text-fontColor uppercase">
                {metric.label}
              </p>
              <span className="app-text-primary text-sm font-semibold">
                {metric.value}
              </span>
            </div>

            <div className="h-2 rounded-full bg-[color:rgba(15,23,42,0.08)]">
              <div
                className="h-2 rounded-full bg-[var(--brand-primary)] transition-all duration-500"
                style={{ width: `${metric.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}