import { Outlet } from "react-router-dom";
import PatientPortalTabs from "../navigation/PatientPortalTabs";

export default function PatientPortalLayout() {
  return (
    <div className="container mx-auto min-h-dvh w-full px-4 py-8">
      <div className="space-y-6">
        <section className="app-surface rounded-3xl p-6">
          <h1 className="app-text-primary text-3xl font-bold">Patient Dashboard</h1>
          <p className="app-text-secondary mt-2">
            Your health data, alerts, and treatment check-ins in one place.
          </p>
        </section>

        <PatientPortalTabs />

        <Outlet />
      </div>
    </div>
  );
}
