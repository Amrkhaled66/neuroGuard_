import { useNavigate } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { useAuth } from "@/features/auth/context/useAuth";
import { hasPermission, PERMISSIONS } from "@/features/auth/permissions";
import Button from "@/shared/ui/Button";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { authData, isAuthenticated, logout } = useAuth();
  const canOpenDoctorRoutes = hasPermission(
    authData.user,
    PERMISSIONS.ACCESS_DOCTOR_ROUTES,
  );
  const primaryHref = canOpenDoctorRoutes
    ? routePaths.doctorDashboard
    : routePaths.signin;

  const handleSignOut = () => {
    logout();
    navigate(routePaths.signin, { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="app-surface w-full max-w-lg space-y-6 rounded-2xl p-6 text-center sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.12em] text-brand-primary uppercase">
            Access denied
          </p>
          <h1 className="app-text-primary text-3xl font-bold">
            You do not have permission to view this page.
          </h1>
          <p className="app-text-secondary">
            This area is restricted to doctor accounts.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate(primaryHref)}
          >
            {canOpenDoctorRoutes ? "Go to dashboard" : "Go to sign in"}
          </Button>
          {isAuthenticated ? (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
