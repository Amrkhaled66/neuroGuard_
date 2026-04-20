import { FiZap } from "react-icons/fi";
import { FaMoon } from "react-icons/fa6";
import type { EventRow, PatternCardItem, SummaryCardItem } from "./types";

export const summaryCards: SummaryCardItem[] = [
  { title: "Total Seizures", value: "12", subtitle: "-15% vs LY" },
  { title: "Avg Duration", value: "1:42", subtitle: "Minutes" },
  { title: "Focal Type", value: "75%", subtitle: "Dominant" },
  { title: "Risk Score", value: "4.2", subtitle: "Moderate" },
  { title: "Adherence", value: "94%", subtitle: "Optimal" },
];

export const patternCards: PatternCardItem[] = [
  {
    title: "Evening Clustering",
    subtitle: "68% of events occur 10PM - 6AM",
    icon: <FaMoon className="h-5 w-5" />,
  },
  {
    title: "Sleep Deprivation",
    subtitle: "High correlation with late events",
    icon: <FiZap className="h-5 w-5" />,
  },
];

export const events: EventRow[] = [
  {
    id: "1",
    dateTime: "Jan 12, 04:22 AM",
    type: "Focal Aware",
    duration: "01:15",
    trigger: "Sleep Deprivation",
    postictalState: "Mild Confusion",
    tone: "low",
  },
  {
    id: "2",
    dateTime: "Jan 08, 09:15 PM",
    type: "Tonic-Clonic",
    duration: "02:45",
    trigger: "Stress / Fatigue",
    postictalState: "Deep Fatigue",
    tone: "high",
  },
  {
    id: "3",
    dateTime: "Dec 29, 05:40 AM",
    type: "Focal Aware",
    duration: "00:50",
    trigger: "Unknown",
    postictalState: "None Recorded",
    tone: "medium",
  },
];
