import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatTrendLabel } from "@/features/doctor/patients/seizures";

type MedicationTrendTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    dataKey?: string;
  }>;
  label?: string;
};

function MedicationTrendTooltip({
  active,
  payload,
  label,
}: MedicationTrendTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const taken = Number(payload.find((item) => item.dataKey === "taken")?.value ?? 0);
  const missed = Number(payload.find((item) => item.dataKey === "missed")?.value ?? 0);

  return (
    <div className="app-surface rounded-2xl border border-stroke px-3 py-2 shadow-lg">
      <p className="app-text-primary text-sm font-semibold">
        {label ? formatTrendLabel(label) : "Unknown"}
      </p>
      <p className="app-text-secondary text-xs">Taken: {taken}</p>
      <p className="app-text-secondary text-xs">Missed: {missed}</p>
    </div>
  );
}

type MedicationAdherenceChartProps = {
  adherenceRate: number;
  trend: Array<{
    date: string;
    taken: number;
    missed: number;
  }>;
};

export default function MedicationAdherenceChart({
  adherenceRate,
  trend,
}: MedicationAdherenceChartProps) {
  return (
    <article className="app-surface rounded-[2rem] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="app-text-primary text-2xl font-bold">Adherence Trend</h3>
          <p className="app-text-secondary mt-2 text-sm">
            Daily taken and missed medication check-ins for the selected range.
          </p>
        </div>
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--brand-primary) ${adherenceRate}%, rgba(148, 163, 184, 0.18) 0)`,
          }}
        >
          <div className="app-surface flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold app-text-primary">
            {adherenceRate}%
          </div>
        </div>
      </div>

      <div className="mt-8 h-[280px] rounded-3xl bg-[var(--surface-muted)]/55 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trend}>
            <CartesianGrid vertical={false} stroke="var(--color-stroke)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatTrendLabel}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              tick={{ fill: "var(--text-tertiary)", fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={32}
              tick={{ fill: "var(--text-tertiary)", fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip content={<MedicationTrendTooltip />} />
            <Bar dataKey="taken" fill="var(--brand-primary)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="missed" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
