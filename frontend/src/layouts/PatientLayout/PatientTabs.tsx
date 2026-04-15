import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Tabs from "@/shared/ui/Tabs";
import { patientSectionRouteMap } from "@/app/router/routes";
type Props = {
  patientId: string;
};

export default function PatientTabs({ patientId }: Props) {
  const { pathname } = useLocation();

  const tabs = useMemo(
    () => [
      {
        key: "profile",
        label: "Profile",
        to: `/patients/${patientId}/${patientSectionRouteMap.profile.path}`,
      },
      {
        key: "eeg-sessions",
        label: "EEG Sessions",
        to: `/patients/${patientId}/${patientSectionRouteMap.eegSessions.path}`,
      },
      {
        key: "seizures",
        label: "Seizures",
        to: `/patients/${patientId}/${patientSectionRouteMap.seizures.path}`,
      },
      {
        key: "notes",
        label: "Notes",
        to: `/patients/${patientId}/${patientSectionRouteMap.notes.path}`,
      },
      {
        key: "notifications",
        label: "Notifications",
        to: `/patients/${patientId}/${patientSectionRouteMap.notifications.path}`,
      },
    ],
    [patientId],
  );

  const activeTab =
    tabs.find((tab) => pathname.endsWith(tab.to.split("/").pop() ?? ""))?.key ??
    "profile";

  return <Tabs tabs={tabs} activeTab={activeTab} onChange={() => {}} />;
}
