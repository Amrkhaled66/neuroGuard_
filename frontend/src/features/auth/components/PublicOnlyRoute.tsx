import { Navigate, Outlet } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { useAuth } from "@/features/auth/context/useAuth";
import { hasPermission, PERMISSIONS } from "@/features/auth/permissions";

export default function PublicOnlyRoute() {
  const { authData, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const redirectPath = hasPermission(
    authData.user,
    PERMISSIONS.ACCESS_DOCTOR_ROUTES,
  )
    ? routePaths.doctorDashboard
    : routePaths.unauthorized;

  return <Navigate to={redirectPath} replace />;
}
