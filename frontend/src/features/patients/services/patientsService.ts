import { axiosPrivate } from "@/shared/lib/axios";
import type { AddPatientFormValues } from "../schemas/patientSchema";

export function createPatient(payload: AddPatientFormValues) {
  return axiosPrivate.post("/patients", payload);
}
