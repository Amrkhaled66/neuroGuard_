import { Outlet, useParams } from "react-router-dom";
import PatientLayoutHeader from "./PatientLayoutHeader";
import type { PatientStatus } from "@/shared/interfaces/PatientStatus";
import PatientTabs from "./PatientTabs";
export interface PatientI {
  id: string;

  /* identity */
  firstName: string;
  lastName: string;
  initials: string;
  avatar?: string;

  /* info */
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

export default function PatientLayout() {
  const { patientId = "" } = useParams();

  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 px-4 pb-6 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8">
      <PatientLayoutHeader patient={patient} />
      <PatientTabs patientId={patientId} />
      <div className="min-w-0">
        <Outlet context={{ patient, isLoading: false }} />
      </div>
    </div>
  );
}
