import { useOutlet, useParams, useLocation } from "react-router-dom";
import PatientLayoutHeader from "./PatientLayoutHeader";
import PatientTabs from "./PatientTabs";
import { motion, AnimatePresence } from "framer-motion";
import { usePatientProfile } from "@/features/patients/hooks";
import type {
  PatientProfilePatient,
  PatientProfileResponse,
} from "@/features/patients/services";

export interface PatientI extends Omit<PatientProfilePatient, "id"> {
  id: string;
}

export type PatientLayoutOutletContext = {
  patient: PatientProfilePatient | null;
  profile: PatientProfileResponse | null;
  isLoading: boolean;
  errorMessage?: string | null;
};

function AnimatedPatientOutlet() {
  const location = useLocation();
  const { patientId } = useParams();
  const parsedPatientId = Number(patientId);
  const profileQuery = usePatientProfile(
    Number.isNaN(parsedPatientId) ? 0 : parsedPatientId,
  );

  const outlet = useOutlet({
    patient: profileQuery.data?.patient ?? null,
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    errorMessage:
      profileQuery.error instanceof Error ? profileQuery.error.message : null,
  } satisfies PatientLayoutOutletContext);

  return (
    <AnimatePresence mode="wait" initial>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

export default function PatientLayout() {
  const { patientId } = useParams();
  const parsedPatientId = Number(patientId);
  const profileQuery = usePatientProfile(
    Number.isNaN(parsedPatientId) ? 0 : parsedPatientId,
  );

  return (
    <div className="container mx-auto flex w-full flex-col gap-5 pb-6 sm:gap-6 lg:gap-8">
      {profileQuery.data?.patient ? (
        <PatientLayoutHeader
          patient={{
            ...profileQuery.data.patient,
            id: String(profileQuery.data.patient.id),
          }}
        />
      ) : profileQuery.isLoading ? (
        <section className="app-surface rounded-3xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 rounded bg-slate-200" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-14 rounded bg-slate-200" />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="app-surface rounded-3xl px-5 py-10 text-red-600 sm:px-6 lg:px-8">
          {profileQuery.error instanceof Error
            ? profileQuery.error.message
            : "Unable to load patient profile."}
        </section>
      )}
      <PatientTabs patientId={patientId} />
      <AnimatedPatientOutlet />
    </div>
  );
}
