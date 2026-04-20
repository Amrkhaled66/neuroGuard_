import { SeizureTrendChartSkeleton } from "../skeletons";

type SeizureTrendChartProps = {
  isLoading?: boolean;
};

export default function SeizureTrendChart({
  isLoading = false,
}: SeizureTrendChartProps) {
  if (isLoading) return <SeizureTrendChartSkeleton />;

  return (
    <div className="app-surface rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="app-text-primary text-3xl font-bold">
            90-Day Seizure Frequency
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Longitudinal trend of neurological events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="app-surface-soft rounded-full px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
            30D
          </button>
          <button className="rounded-full bg-[var(--brand-primary)] px-3 py-1 text-xs font-semibold text-white">
            90D
          </button>
          <button className="app-surface-soft rounded-full px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
            1Y
          </button>
        </div>
      </div>

      <div className="mt-8 h-[260px] rounded-2xl bg-[var(--surface-muted)]/40 p-4">
        <svg viewBox="0 0 800 240" className="h-full w-full">
          <path
            d="M0,210 C60,190 100,205 140,180 C180,155 220,160 260,210 C300,255 340,70 380,150 C420,230 460,240 500,65 C540,-5 580,210 620,215 C660,220 710,240 800,170"
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-3 flex justify-between text-[11px] font-semibold tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
          <span>Oct 2023</span>
          <span>Nov 2023</span>
          <span>Dec 2023</span>
          <span>Jan 2024</span>
        </div>
      </div>
    </div>
  );
}
