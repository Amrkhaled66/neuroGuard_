import { motion } from "framer-motion";
import Avatar from "@/assets/avatar.svg";
import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { CiWarning } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import statusMap from "@/shared/interfaces/PatientStatus";
import type { DoctorDashboardCriticalPatient } from "../types";
import { formatDashboardLastSession } from "../types";

import CriticalPatientsSkeleton from "../skeletons/CriticalPatientsSkeleton";

type CriticalPatientsProps = {
  items: DoctorDashboardCriticalPatient[];
  isLoading?: boolean;
};

const CriticalPatients = ({
  items,
  isLoading = false,
}: CriticalPatientsProps) => {
  if (isLoading) {
    return <CriticalPatientsSkeleton />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="app-surface app-text-primary h-fit space-y-5 rounded-xl p-5 sm:p-6 lg:col-span-2 lg:space-y-6 lg:p-8"
    >
      <div className="space-y-1">
        <p className="font-bold flex items-center gap-x-2 font-headline text-xl text-status-critical sm:text-2xl">
          <CiWarning />
          Critical Patients
        </p>
      </div>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="app-surface-soft rounded-2xl px-4 py-6 text-sm app-text-secondary">
            No critical patients in the current dashboard view.
          </div>
        ) : (
          items.map((patient) => {
            const status = statusMap[patient.status];

            return (
              <div
                key={patient.id}
                className="animate flex cursor-pointer flex-col gap-4 rounded-2xl px-4 py-4 hover:bg-brand-primary-soft/40 sm:flex-row sm:items-center sm:justify-between sm:py-5"
              >
                <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:gap-4">
                  <img
                    src={Avatar}
                    alt="Avatar"
                    className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{patient.name}</p>
                    <p className="app-text-secondary text-sm">
                      Medical ID: {patient.medicalId}
                    </p>
                    <p className="app-text-secondary text-xs">
                      Last session: {formatDashboardLastSession(patient.lastSessionDate)}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase ${status.textClass}`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${status.dotClass}`} />
                    {status.label}
                  </div>
                  <p className="text-xs app-text-secondary">
                    {patient.seizureCountInRange} seizures in range
                  </p>
                  <Link
                    to={routePaths.patientDetails.replace(
                      ":patientId",
                      String(patient.id),
                    )}
                    className="app-surface-soft animate flex w-full items-center justify-center gap-x-1 rounded-2xl px-4 py-3 text-brand-primary hover:bg-brand-primary-soft/50 sm:w-auto sm:py-2"
                  >
                    View Patient
                    <IoIosArrowRoundForward className="text-2xl" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default CriticalPatients;
