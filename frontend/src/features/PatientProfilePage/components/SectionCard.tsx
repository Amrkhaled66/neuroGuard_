import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`rounded-3xl border border-stroke/60 app-surface app-text-primary p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
