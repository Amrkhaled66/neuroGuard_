import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, getPatientSessions } from "../services";
import type { CreateSessionPayload } from "../schemas/sessionSchema";
import type { PatientSession } from "../types";

export const sessionQueryKeys = {
  all: ["sessions"] as const,
  lists: ["sessions", "list"] as const,
  list: (patientId: number) => ["sessions", "list", patientId] as const,
};

export function usePatientSessions(patientId: number) {
  return useQuery<PatientSession[]>({
    queryKey: sessionQueryKeys.list(patientId),
    queryFn: () => getPatientSessions(patientId),
    enabled: !!patientId,
    refetchInterval: (query) =>
      query.state.data?.some((session) => session.status === "processing")
        ? 3000
        : false,
    refetchIntervalInBackground: true,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["sessions", "create"] as const,
    mutationFn: (payload: CreateSessionPayload) => createSession(payload),
    onSuccess: (_, payload) => {
      void queryClient.invalidateQueries({
        queryKey: sessionQueryKeys.list(payload.patientId),
      });
      void queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all });
    },
  });
}
