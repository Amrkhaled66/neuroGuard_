import type { ReactNode } from "react";

type StaticCardProps = {
  value: ReactNode;
  label: string;
  icon: ReactNode;
  isDanger?: boolean;
};

export default function StaticCard({
  value,
  label,
  icon,
  isDanger,
}: StaticCardProps) {
  return (
    <div
      className="app-surface app-text-primary animate cursor-pointer rounded-3xl p-6 hover:-translate-y-4"
    >
      <div
        className={`p-3 text-xl rounded-2xl w-fit  ${isDanger ? "text-status-danger bg-status-danger-soft" : " text-status-success bg-status-success-soft "}`}
      >
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>
        <p className="app-text-secondary text-xs uppercase">{label}</p>
      </div>
    </div>
  );
}
