import { Outlet } from "react-router-dom";
import AppHeader from "@/shared/components/AppHeader";
import { useAuth } from "@/features/auth/context/useAuth";
import { usePatientPortalNavItems } from "../navigation/PatientPortalTabs";

export default function PatientPortalLayout() {
  const { authData } = useAuth();
  const user = authData.user;
  const navItems = usePatientPortalNavItems();
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient";

  return (
    <div className="space-y-0 pb-8">
      <AppHeader navItems={navItems} userName={name} />
      <main className="container mx-auto min-h-screen px-4">
        <Outlet />
      </main>
    </div>
  );
}
