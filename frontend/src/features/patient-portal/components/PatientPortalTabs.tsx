import { NavLink } from "react-router-dom";
import { patientPortalRouteMap } from "../router/patientPortalRoutes";

export default function PatientPortalTabs() {
  const tabs = Object.values(patientPortalRouteMap);

  return (
    <nav className="app-surface rounded-3xl p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              [
                "animate rounded-2xl px-4 py-2 text-sm font-semibold",
                isActive
                  ? "bg-brand-primary-soft text-brand-primary"
                  : "app-text-secondary hover:bg-brand-primary-soft/40",
              ].join(" ")
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
