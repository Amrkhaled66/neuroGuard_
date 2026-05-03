import { axiosPrivate } from "@/shared/lib/axios";

export interface Medication {
  id: number;
  name: string;
  form: "tablet" | "capsule" | "liquid" | "injection" | "other";
  doctorId: number;
}

export async function getMedications() {
  return await axiosPrivate.get<Medication[]>("/medications");
}
