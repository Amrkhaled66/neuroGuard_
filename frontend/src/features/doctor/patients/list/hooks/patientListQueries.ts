import { useQuery } from "@tanstack/react-query";
import { getPatients, type GetPatientsParams } from "../services/patientsListService";

export const patientListQueryKeys = {
  all: ["patients", "list"] as const,
  page: (page: number, limit: number) => ["patients", "list", page, limit] as const,
};

export function usePatientsQuery(params: GetPatientsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return useQuery({
    queryKey: patientListQueryKeys.page(page, limit),
    queryFn: () => getPatients({ page, limit }),
  });
}
