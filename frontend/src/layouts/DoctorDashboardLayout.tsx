import { StaticCards } from "@/shared/sections/StaticCards";
import { Outlet } from "react-router-dom";
const DoctorDashboardLayout = () => {
  return (
    <div className="space-y-8 container mx-auto ">
      <StaticCards />
      <Outlet />
    </div>
  );
};

export default DoctorDashboardLayout;
