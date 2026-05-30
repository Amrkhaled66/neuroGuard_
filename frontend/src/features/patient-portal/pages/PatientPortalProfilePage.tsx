import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { useAuth } from "@/features/auth/context/useAuth";

export default function PatientPortalProfilePage() {
  const { authData } = useAuth();
  const user = authData.user;

  return (
    <section className="app-surface rounded-3xl p-6">
      <h2 className="app-text-primary text-2xl font-bold">Profile</h2>
      <p className="app-text-secondary mt-2">
        Profile integration comes next (planned: patient-scoped `/patients/me/profile`).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>

      <div className="mt-6">
        <Link
          to={routePaths.patientLogin}
          className="text-brand-primary font-semibold hover:underline"
        >
          Not you? Sign in again
        </Link>
      </div>
    </section>
  );
}
