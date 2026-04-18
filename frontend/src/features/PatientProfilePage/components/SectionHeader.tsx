import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  action?: ReactNode;
};

export default function SectionHeader({
  title,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <h3 className="font-label text-xs font-extrabold uppercase tracking-[0.14em] text-brand-primary">
        {title}
      </h3>
      {action}
    </div>
  );
}
