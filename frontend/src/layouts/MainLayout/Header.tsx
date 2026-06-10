import AppHeader from "@/shared/components/AppHeader";
import { useAuth } from "@/features/auth/context/useAuth";

const navItems = [
  { label: "Home", path: "/DoctorDashboardPage" },
  { label: "Patients", path: "/patients" },
];

const Header = () => {
  const { authData } = useAuth();
  const user = authData.user;
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Doctor";

  return (
    <AppHeader navItems={navItems} userName={name} />
  );
};

export default Header;
