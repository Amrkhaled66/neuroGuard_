import { BiCircle } from "react-icons/bi";
import type { PatientI } from "./PatientLayout";
import statusMap from "@/shared/interfaces/PatientStatus";
type Props = {
  patient: PatientI;
};

export default function PatientHeaderLayout({ patient }: Props) {
  const status = statusMap[patient.status];

  function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return (
    <section className="app-surface rounded-3xl px-5 py-6 shadow-sm backdrop-blur-3xl sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-primary sm:h-24 sm:w-24 lg:h-32 lg:w-32">
            <span className="text-3xl font-semibold tracking-tight text-[#B8F3D8] sm:text-4xl lg:text-5xl">
              {patient.initials}
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="app-text-primary truncate text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {patient.firstName} {patient.lastName}
            </h1>

            <div
              className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm ${status.textClass}`}
            >
              <BiCircle
                className={`size-3.5 rounded-full fill-current ${status.dotClass}`}
              />
              <span>{status.label}</span>
            </div>
          </div>

          <div className="app-border hidden h-14 w-px border-l lg:block" />
        </div>

        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          <InfoBlock label="Medical ID" value={patient.medicalId} />
          <InfoBlock
            label="Age/Gender"
            value={`${patient.age} / ${capitalize(patient.gender)}`}
          />
          <InfoBlock label="Physician" value={patient.physician} />
          <InfoBlock label="Admission" value={patient.admissionDate} />
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="app-text-secondary text-xs font-semibold uppercase tracking-[0.08em] sm:text-sm">
        {label}
      </p>
      <p className="app-text-primary mt-2 truncate text-sm font-medium sm:text-base">
        {value}
      </p>
    </div>
  );
}
