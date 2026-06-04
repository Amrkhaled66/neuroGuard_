type OverviewHeroProps = {
  fullName?: string;
  medicalId?: string;
  physician?: string;
  status?: "stable" | "monitoring" | "critical";
  age?: number;
  monitoringTime?: string;
  lastSessionDate?: string | null;
  formatDate: (value: string | null | undefined, fallback?: string) => string;
};

function getStatusTone(status: "stable" | "monitoring" | "critical") {
  if (status === "critical") {
    return "bg-rose-100 text-rose-700";
  }

  if (status === "monitoring") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

export default function OverviewHero({
  fullName,
  medicalId,
  physician,
  status,
  age,
  monitoringTime,
  lastSessionDate,
  formatDate,
}: OverviewHeroProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
      <article className="app-surface rounded-[2rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
              Patient Overview
            </p>
            <h2 className="app-text-primary mt-3 text-3xl font-bold">
              {fullName ?? "Loading profile"}
            </h2>
            <p className="app-text-secondary mt-2 text-sm">
              {physician && medicalId
                ? `${physician} | Medical ID ${medicalId}`
                : "Loading monitoring summary"}
            </p>
          </div>

          {status ? (
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusTone(status)}`}
            >
              {status}
            </span>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-[var(--surface-muted)]/70 p-4">
            <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
              Age
            </p>
            <p className="app-text-primary mt-2 text-2xl font-bold">
              {age ?? "--"}
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--surface-muted)]/70 p-4">
            <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
              Monitoring Time
            </p>
            <p className="app-text-primary mt-2 text-2xl font-bold">
              {monitoringTime ?? "--"}
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--surface-muted)]/70 p-4">
            <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
              Last EEG Session
            </p>
            <p className="app-text-primary mt-2 text-lg font-bold">
              {formatDate(lastSessionDate, "No session yet")}
            </p>
          </div>
        </div>
      </article>

      <article className="app-surface rounded-[2rem] p-6">
        <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
          Care Team
        </p>
        <h3 className="app-text-primary mt-3 text-2xl font-bold">
          {physician ?? "Assigned doctor"}
        </h3>
        <p className="app-text-secondary mt-3 text-sm leading-6">
          Your dashboard tracks seizure activity, treatment adherence, alerts, and EEG monitoring
          updates in one place.
        </p>
        <div className="mt-6 rounded-3xl bg-[var(--surface-muted)]/70 p-4">
          <p className="app-text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
            Medical ID
          </p>
          <p className="app-text-primary mt-2 text-sm leading-6">
            {medicalId ?? "Unavailable"}
          </p>
        </div>
      </article>
    </div>
  );
}
