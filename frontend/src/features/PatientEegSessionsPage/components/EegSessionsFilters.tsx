import { sessionStatusMap, type SessionStatus } from "../types";

type EegSessionsFiltersProps = {
  activeStatus: SessionStatus | "all";
  onStatusChange: (status: SessionStatus | "all") => void;
};

export default function EegSessionsFilters({
  activeStatus,
  onStatusChange,
}: EegSessionsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(["all", "analyzed", "processing", "failed"] as const).map((status) => {
        const isActive = activeStatus === status;

        return (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-brand-primary text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status === "all" ? "All" : sessionStatusMap[status].label}
          </button>
        );
      })}
    </div>
  );
}
