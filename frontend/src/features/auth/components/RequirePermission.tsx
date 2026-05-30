import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { useAuth } from "@/features/auth/context/useAuth";
import {
  hasPermission,
  PERMISSIONS,
  type Permission,
} from "@/features/auth/permissions";

type RequirePermissionProps = {
  permission: Permission;
  children?: ReactNode;
};

export default function RequirePermission({
  permission,
  children,
}: RequirePermissionProps) {
  const { authData, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath =
      permission === PERMISSIONS.ACCESS_PATIENT_ROUTES
        ? routePaths.patientLogin
        : routePaths.signin;

    return (
      <Navigate to={loginPath} replace state={{ from: location }} />
    );
  }

  if (!hasPermission(authData.user, permission)) {
    return <Navigate to={routePaths.unauthorized} replace />;
  }

  return children ?? <Outlet />;
}
