import {
  DashboardPage,
  LoginPage,
  NotesPage,
  NotificationsPage,
  PatientEegSessionsPage,
  PatientProfilePage,
  PatientsPage,
  SeizuresPage,
  SignupPage,
} from "@/pages";
import { routePaths } from "./paths";

export const patientSectionRouteMap = {
  profile: {
    name: "profile",
    label: "Profile",
    path: "profile",
    Component: PatientProfilePage,
  },
  eegSessions: {
    name: "eegSessions",
    label: "EEG Sessions",
    path: "eeg-sessions",
    Component: PatientEegSessionsPage,
  },
  seizures: {
    name: "seizures",
    label: "Seizures",
    path: "seizures",
    Component: SeizuresPage,
  },
  notes: {
    name: "notes",
    label: "Notes",
    path: "notes",
    Component: NotesPage,
  },
  notifications: {
    name: "notifications",
    label: "Notifications",
    path: "notifications",
    Component: NotificationsPage,
  },
} as const;

export const topLevelRouteMap = {
  login: {
    name: "login",
    path: routePaths.login,
    Component: LoginPage,
  },
  signup: {
    name: "signup",
    path: routePaths.signup,
    Component: SignupPage,
  },
  doctorDashboard: {
    name: "dashboard",
    path: routePaths.doctorDashboard,
    Component: DashboardPage,
  },
  patients: {
    name: "patients",
    path: routePaths.patients,
    Component: PatientsPage,
  },
} as const;
