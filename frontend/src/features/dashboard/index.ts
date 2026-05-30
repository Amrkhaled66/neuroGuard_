export { default as CriticalPatients } from "./components/CriticalPatients";
export { default as QuickActions } from "./components/QuickActions";
export { default as RealTimeInsights } from "./components/RealTimeInsights";
export { default as SeizureActivityChart } from "./components/SeizureActivityChart";
export * from "./hooks";
export * from "./services";
export type {
  DoctorDashboardCriticalPatient,
  DoctorDashboardResponse,
  DoctorDashboardTrendPoint,
} from "./types";
export {
  formatDashboardDateTime,
  formatDashboardLastSession,
  formatTrendLabel,
} from "./types";
