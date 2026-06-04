import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Tabs from "@/shared/ui/Tabs";
import { patientPortalRouteMap } from "@/features/patient/portal/routes";

export default function PatientPortalTabs() {
  const { pathname } = useLocation();
  const tabs = useMemo(
    () =>
      Object.values(patientPortalRouteMap).map((tab) => ({
        key: tab.name,
        label: tab.label,
        to: tab.path,
      })),
    [],
  );
  const activeTab = tabs.find((tab) => pathname.startsWith(tab.to))?.key ?? tabs[0]?.key ?? "";

  return <Tabs tabs={tabs} activeTab={activeTab} />;
}
