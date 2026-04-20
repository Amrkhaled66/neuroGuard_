import type { HealthMetric, NotificationItem } from "./types";
export const notificationsData: NotificationItem[] = [
  {
    id: "1",
    title: "EEG Connectivity Warning",
    data: "10:42 AM Today",
    message:
      "System detected significant impedance on Electrode C4. The patient has been notified to re-adjust the headset for accurate neurological mapping.",
    status: "read",
    source: "Neuroguard Core AI",
  },
  {
    id: "2",
    title: "Medication Adjustment Required",
    data: "Yesterday, 4:15 PM",
    message:
      "Increased baseline cortical activity suggests a tolerance shift. Please increase Levetiracetam dosage to 750mg for the evening administration starting immediately.",
    status: "sent",

    source: "Dr. Sarah Jenkins",
  },
  {
    id: "3",
    title: "Post-Seizure Recovery Check",
    data: "Oct 24, 09:00 AM",
    message:
      "Checking in following the focal seizure event recorded at 03:20 AM. Please confirm current alertness levels and if additional rescue medication was utilized.",
    status: "read",
    source: "Dr. Elena Rodriguez",
  },
];

export const communicationHealthData: HealthMetric[] = [
  {
    id: "1",
    label: "Patient Response Rate",
    value: "94%",
    progress: 94,
  },
  {
    id: "2",
    label: "Avg. Response Time",
    value: "12m",
    progress: 30,
  },
];
