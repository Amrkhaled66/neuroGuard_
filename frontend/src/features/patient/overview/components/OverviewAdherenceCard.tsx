type OverviewAdherenceCardProps = {
  adherenceRate?: number;
  takenCount?: number;
  missedCount?: number;
  scheduledCount?: number;
};

export default function OverviewAdherenceCard({
  adherenceRate = 0,
  takenCount = 0,
  missedCount = 0,
  scheduledCount = 0,
}: OverviewAdherenceCardProps) {
  return (
    <article className="app-surface rounded-[2rem] p-6">
      <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
        Medication Adherence
      </p>
      <div className="mt-6 flex items-center gap-5">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--brand-primary) ${adherenceRate}%, rgba(148, 163, 184, 0.18) 0)`,
          }}
        >
          <div className="app-surface flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold app-text-primary">
            {adherenceRate}%
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="app-text-primary font-semibold">{takenCount} taken</p>
          <p className="app-text-secondary">{missedCount} missed</p>
          <p className="app-text-secondary">{scheduledCount} scheduled</p>
        </div>
      </div>
    </article>
  );
}
