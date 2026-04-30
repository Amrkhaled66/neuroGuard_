import { Routes, Route, Navigate } from "react-router-dom";
import { topLevelRouteMap, patientSectionRouteMap } from "./routes";
import { routePaths } from "./paths";
import RequirePermission from "@/features/auth/components/RequirePermission";
import PublicOnlyRoute from "@/features/auth/components/PublicOnlyRoute";
import { PERMISSIONS } from "@/features/auth/permissions";
import {
  MainLayout,
  DoctorDashboardLayout,
  PatientLayout,
} from "@/layouts/index";

export function AppRouter() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path={routePaths.root}
        element={<Navigate to={routePaths.signin} replace />}
      />

      {/* Top-level routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route
          path={topLevelRouteMap.signin.path}
          element={<topLevelRouteMap.signin.Component />}
        />
        <Route
          path={topLevelRouteMap.signup.path}
          element={<topLevelRouteMap.signup.Component />}
        />
      </Route>

      <Route
        path={routePaths.unauthorized}
        element={<topLevelRouteMap.unauthorized.Component />}
      />

      <Route
        element={
          <RequirePermission permission={PERMISSIONS.ACCESS_DOCTOR_ROUTES} />
        }
      >
        <Route element={<MainLayout />}>
          <Route element={<DoctorDashboardLayout />}>
            <Route
              path={topLevelRouteMap.doctorDashboard.path}
              element={<topLevelRouteMap.doctorDashboard.Component />}
            />
            <Route
              path={topLevelRouteMap.patients.path}
              element={<topLevelRouteMap.patients.Component />}
            />
          </Route>
          <Route element={<PatientLayout />} path={routePaths.patientDetails}>
            {/* default redirect */}
            <Route
              index
              element={
                <Navigate to={patientSectionRouteMap.profile.path} replace />
              }
            />

            <Route
              path={patientSectionRouteMap.profile.path}
              element={<patientSectionRouteMap.profile.Component />}
            />
            <Route
              path={patientSectionRouteMap.eegSessions.path}
              element={<patientSectionRouteMap.eegSessions.Component />}
            />
            <Route
              path={patientSectionRouteMap.seizures.path}
              element={<patientSectionRouteMap.seizures.Component />}
            />
            <Route
              path={patientSectionRouteMap.notes.path}
              element={<patientSectionRouteMap.notes.Component />}
            />
            <Route
              path={patientSectionRouteMap.notifications.path}
              element={<patientSectionRouteMap.notifications.Component />}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={routePaths.unauthorized} replace />}
      />
    </Routes>
  );
}
