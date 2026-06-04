export type DashboardNavItem = {
  label: string;
  href: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "dashboard", href: "/dashboard" },
  { label: "Patients", href: "/patients" },
];

export const dashboardDoctorProfile = {
  role: "Chief Neurologist",
  name: "Dr. Aris Thorne",
  initials: "AT",
};
