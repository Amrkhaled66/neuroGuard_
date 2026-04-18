import { LuCircleCheckBig, LuTriangleAlert } from "react-icons/lu";

import type { AlertItem } from "../types";
import { AlertsCardSkeleton } from "../skeletons";
import SectionCard from "./SectionCard";
import SectionHeader from "./SectionHeader";

type AlertsCardProps = {
  alerts: AlertItem[];
  isLoading?: boolean;
};

export default function AlertsCard({
  alerts,
  isLoading = false,
}: AlertsCardProps) {
  if (isLoading) return <AlertsCardSkeleton />;

  return (
    <SectionCard>
      <SectionHeader title="Alerts & Recommendations" />

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const isWarning = alert.type === "warning";

          return (
            <div
              key={`${alert.message}-${index}`}
              className="bg-surface-muted/40 flex items-start gap-3 rounded-2xl px-4 py-3"
            >
              <span
                className={`mt-0.5 inline-flex size-6 items-center justify-center rounded-full ${
                  isWarning
                    ? "bg-status-warning-soft text-status-warning"
                    : "bg-status-success-soft text-status-success"
                }`}
              >
                {isWarning ? (
                  <LuTriangleAlert className="size-4" />
                ) : (
                  <LuCircleCheckBig className="size-4" />
                )}
              </span>

              <p className="text-foreground text-sm">{alert.message}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
