import { axiosPrivate } from "@/shared/lib/axios";
import type { DoctorDashboardResponse } from "../types";

export type GetDoctorDashboardParams = {
  days?: number;
};

export function getDoctorDashboard(
  params: GetDoctorDashboardParams = {},
) {
  return axiosPrivate.get<DoctorDashboardResponse, DoctorDashboardResponse>(
    "/doctors/dashboard",
    {
      params,
    },
  );
}
