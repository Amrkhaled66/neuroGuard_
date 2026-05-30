import { useAuth } from "@/features/auth/context/useAuth";
import { PERMISSIONS, hasPermission } from "@/features/auth/permissions";

export default function PatientProfileStartPage() {
  const { authData } = useAuth();
  const user = authData.user;
  const canOpenPatientRoutes = hasPermission(user, PERMISSIONS.ACCESS_PATIENT_ROUTES);

  return (
    <main className="space-y-6">
      <section className="app-surface rounded-3xl p-6">
        <h1 className="app-text-primary text-3xl font-bold">Profile</h1>
        <p className="app-text-secondary mt-2">
          Patient portal is active. Profile data integration comes next.
        </p>
      </section>

      <section className="app-surface rounded-3xl p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="app-text-secondary text-xs font-semibold uppercase tracking-[0.08em]">
              Role
            </p>
            <p className="app-text-primary mt-2 text-sm font-medium">
              {user?.role ?? "unknown"}
            </p>
          </div>
          <div>
            <p className="app-text-secondary text-xs font-semibold uppercase tracking-[0.08em]">
              Medical ID
            </p>
            <p className="app-text-primary mt-2 text-sm font-medium">
              {user?.medicalId ?? "unknown"}
            </p>
          </div>
          <div>
            <p className="app-text-secondary text-xs font-semibold uppercase tracking-[0.08em]">
              Access
            </p>
            <p className="app-text-primary mt-2 text-sm font-medium">
              {canOpenPatientRoutes ? "patient routes allowed" : "denied"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
