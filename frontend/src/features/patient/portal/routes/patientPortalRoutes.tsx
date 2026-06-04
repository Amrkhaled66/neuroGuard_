import { routePaths } from "@/app/router/paths";

export const patientPortalRouteMap = {
  profile: {
    name: "profile",
    label: "Overview",
    path: routePaths.patientProfile,
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
  notifications: {
    name: "notifications",
    label: "Notifications",
    path: routePaths.patientNotifications,
  },
} as const;

export type PatientPortalRouteKey = keyof typeof patientPortalRouteMap;
