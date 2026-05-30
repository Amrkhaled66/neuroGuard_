import { routePaths } from "@/app/router/paths";

export const patientPortalRouteMap = {
  profile: {
    name: "profile",
    label: "Profile",
    path: routePaths.patientProfile,
  },
  eegSessions: {
    name: "eegSessions",
    label: "EEG Sessions",
    path: routePaths.patientEegSessions,
  },
  seizures: {
    name: "seizures",
    label: "Seizures",
    path: routePaths.patientSeizures,
  },
  medications: {
    name: "medications",
    label: "Medications",
    path: routePaths.patientMedications,
  },
} as const;

export type PatientPortalRouteKey = keyof typeof patientPortalRouteMap;
