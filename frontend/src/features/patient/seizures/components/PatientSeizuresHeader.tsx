type PatientSeizuresHeaderProps = {
  days: 7 | 30 | 90;
  onChangeDays: (days: 7 | 30 | 90) => void;
};

export default function PatientSeizuresHeader({
  days,
  onChangeDays,
}: PatientSeizuresHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="app-text-secondary text-xs font-semibold tracking-[0.16em] uppercase">
          Seizure Insights
        </p>
        <h2 className="app-text-primary mt-2 text-3xl font-bold">
          Understand your recent seizure activity
        </h2>
        <p className="app-text-secondary mt-2 text-sm">
          Trends, recent events, and session patterns from your analyzed EEG data.
        </p>
      </div>

      <div className="flex gap-2 rounded-full bg-[var(--surface-muted)]/75 p-1">
        {[7, 30, 90].map((value) => (
          <button
            key={value}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              days === value
                ? "bg-white text-[var(--brand-primary)] shadow-sm"
                : "app-text-secondary"
            }`}
            onClick={() => onChangeDays(value as 7 | 30 | 90)}
          >
            {value} days
          </button>
        ))}
      </div>
    </div>
  );
}
