import statusMap, { patientStatuses } from "@/shared/interfaces/PatientStatus";
import type { PatientStatus } from "@/shared/interfaces/PatientStatus";

const baseButtonClass =
  "animate rounded-full border px-4 py-2  text-sm font-semibold transition";

const inactiveButtonClass =
  "hover:border-brand-primary/40 bg-surface-muted hover:text-brand-primary border-black/10  dark:border-white/10 dark:bg-white/5";

const activeButtonClass = "border-brand-primary bg-brand-primary text-white";

const getButtonClassName = (isActive: boolean, extraClassName = "") =>
  [baseButtonClass, extraClassName, isActive ? activeButtonClass : inactiveButtonClass]
    .filter(Boolean)
    .join(" ");

const PatientsStatusFilters = ({
  activeStatus,
  handleStatusChange,
}: {
  activeStatus: PatientStatus | "all";
  handleStatusChange: (status: PatientStatus | "all") => void;
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => handleStatusChange("all")}
        className={getButtonClassName(activeStatus === "all")}
      >
        All
      </button>
      {patientStatuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => handleStatusChange(status)}
          className={getButtonClassName(
            activeStatus === status,
            "inline-flex items-center gap-2",
          )}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${statusMap[status].dotClass}`}
          />
          {statusMap[status].label}
        </button>
      ))}
    </div>
  );
};

export default PatientsStatusFilters;
