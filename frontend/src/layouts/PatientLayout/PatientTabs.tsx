import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Tabs from "@/shared/ui/Tabs";
import { patientSectionRouteMap } from "@/app/router/routes";
type Props = {
  patientId: string|undefined;
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
        key: "medications",
        label: "Medications",
        to: `/patients/${patientId}/${patientSectionRouteMap.medications.path}`,
      },
      // {
      //   key: "notes",
      //   label: "Notes",
      //   to: `/patients/${patientId}/${patientSectionRouteMap.notes.path}`,
      // },
      {
        key: "notifications",
        label: "Notifications",
        to: `/patients/${patientId}/${patientSectionRouteMap.notifications.path}`,
      },
    ],
    [patientId],
  );

  const activeTab = pathname.split("/").at(-1) || "profile";

  return <Tabs tabs={tabs} activeTab={activeTab} />;
}
