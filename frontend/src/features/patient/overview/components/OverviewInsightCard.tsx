type OverviewInsightCardProps = {
  title?: string;
  description?: string;
  sessionCount?: number;
  latestSessionStatus?: string | null;
};

export default function OverviewInsightCard({
  title,
  description,
  sessionCount,
  latestSessionStatus,
}: OverviewInsightCardProps) {
  return (
    <article className="app-surface rounded-[2rem] p-6">
      <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
        Latest Insight
      </p>
      <h3 className="app-text-primary mt-2 text-2xl font-bold">
        {title ?? "Loading insight"}
      </h3>
      <p className="app-text-secondary mt-4 text-sm leading-7">
        {description ?? "Reviewing your latest seizure and EEG activity."}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-[var(--surface-muted)]/70 p-4">
          <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
            Session Count
          </p>
          <p className="app-text-primary mt-2 text-2xl font-bold">{sessionCount ?? "--"}</p>
        </div>
        <div className="rounded-3xl bg-[var(--surface-muted)]/70 p-4">
          <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
            Latest Session Status
          </p>
          <p className="app-text-primary mt-2 text-xl font-bold capitalize">
            {latestSessionStatus ?? "Unknown"}
          </p>
        </div>
      </div>
    </article>
  );
}
