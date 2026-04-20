import type { PatternCardItem } from "../types";
import { PatternCardSkeleton } from "../skeletons";

type PatternCardProps = PatternCardItem & {
  isLoading?: boolean;
};

export default function PatternCard({
  title,
  subtitle,
  icon,
  isLoading = false,
}: PatternCardProps) {
  if (isLoading) return <PatternCardSkeleton />;

  return (
    <div className="app-surface-soft flex items-start gap-3 rounded-2xl p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        {icon}
      </div>
      <div>
        <h4 className="app-text-primary text-sm font-semibold">{title}</h4>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">{subtitle}</p>
      </div>
    </div>
  );
}
