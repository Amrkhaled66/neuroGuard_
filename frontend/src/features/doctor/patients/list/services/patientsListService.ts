import { axiosPrivate } from "@/shared/lib/axios";
import type { PatientStatus } from "@/shared/interfaces/PatientStatus";

export type PatientsListItem = {
  id: string;
  name: string;
  age: number;
  medicalId: string;
  sessionFilesNumber: number;
  lastSessionDate: string | null;
  status: PatientStatus;
};

export type PatientsListResponse = {
  items: PatientsListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetPatientsParams = {
  page?: number;
  limit?: number;
};

export async function getPatients(
  params: GetPatientsParams = {},
): Promise<PatientsListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/patients?${queryString}` : "/patients";

  return axiosPrivate.get<unknown,PatientsListResponse>(url);
}
