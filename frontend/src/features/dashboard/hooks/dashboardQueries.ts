import { useQuery } from "@tanstack/react-query";
import { getDoctorDashboard, type GetDoctorDashboardParams } from "../services";

export const doctorDashboardQueryKeys = {
  all: ["doctor-dashboard"] as const,
  detail: (days: number) => ["doctor-dashboard", days] as const,
};

export function useDoctorDashboard(params: GetDoctorDashboardParams = {}) {
  const days = params.days ?? 7;

  return useQuery({
    queryKey: doctorDashboardQueryKeys.detail(days),
    queryFn: () => getDoctorDashboard({ days }),
  });
}
