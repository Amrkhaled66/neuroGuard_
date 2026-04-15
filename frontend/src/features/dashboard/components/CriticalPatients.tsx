import { motion } from "framer-motion";
import Avatar from "@/assets/avatar.svg";
import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { CiWarning } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";

import CriticalPatientsSkeleton from "../skeletons/CriticalPatientsSkeleton";
const fakePatients = [
  {
    name: "John Doe",
    lastsession: "2024-06-01",
    medicalId: "mdi-123456",
  },
  {
    name: "John Doe",
    lastsession: "2024-06-01",
    medicalId: "mdi-123456",
  },
  {
    name: "John Doe",
    lastsession: "2024-06-01",
    medicalId: "mdi-123456",
  },
];
const CriticalPatients = () => {
  const isLoading = false;
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
        {fakePatients.map((patient) => (
          <div
            key={patient.medicalId}
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
              </div>
            </div>
            <Link
              to={`${routePaths}/patient/${patient.medicalId}`}
              className="app-surface-soft animate flex w-full items-center justify-center gap-x-1 rounded-2xl px-4 py-3 text-brand-primary hover:bg-brand-primary-soft/50 sm:w-auto sm:py-2"
            >
              View Patient
              <IoIosArrowRoundForward className="text-2xl" />
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CriticalPatients;
