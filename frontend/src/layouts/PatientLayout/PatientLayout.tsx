import { useOutlet, useParams, useLocation } from "react-router-dom";
import PatientLayoutHeader from "./PatientLayoutHeader";
import type { PatientStatus } from "@/shared/interfaces/PatientStatus";
import PatientTabs from "./PatientTabs";
import { motion, AnimatePresence } from "framer-motion";

export interface PatientI {
  id: string;

  firstName: string;
  lastName: string;
  initials: string;
  avatar?: string;

  medicalId: string;
  age: number;
  gender: "male" | "female";

  physician: string;
  admissionDate: string;

  status: PatientStatus;
}

export const patient: PatientI = {
  id: "1",
  firstName: "Arthur",
  lastName: "Samuels",
  initials: "AS",
  medicalId: "NG-992-04-X",
  age: 42,
  gender: "male",
  physician: "Dr. Elena Vance",
  admissionDate: "Oct 12, 2023",
  status: "monitoring",
};

function AnimatedPatientOutlet() {
  const location = useLocation();
  const outlet = useOutlet({
    patient,
    isLoading: false,
  });

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

  return (
    <div className="container mx-auto flex w-full flex-col gap-5 pb-6 sm:gap-6 lg:gap-8">
      <PatientLayoutHeader patient={patient} />
      <PatientTabs patientId={patientId} />
      <AnimatedPatientOutlet />
    </div>
  );
}
