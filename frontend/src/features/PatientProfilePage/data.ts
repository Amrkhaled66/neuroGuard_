import type { ProfileOverviewData } from "./types";

export const demoData: ProfileOverviewData = {
  clinicalOverview: [
    { label: "Diagnosis", value: "Refractory TLE" },
    { label: "Seizure Type", value: "Complex Partial" },
    { label: "Frequency", value: "2.4/week avg" },
    { label: "Brain Region", value: "Left Hippocampal" },
  ],
  medications: [
    {
      name: "Levetiracetam",
      dosage: "1000mg BID",
      status: "High Adherence",
    },
    {
      name: "Lacosamide",
      dosage: "200mg BID",
      status: "High Adherence",
    },
  ],
  trend: {
    percent: 12,
    lastSeizure: "Oct 24, 14:20",
    points: [
      { x: "W1", y: 92 },
      { x: "W2", y: 68 },
      { x: "W3", y: 76 },
      { x: "W4", y: 44 },
      { x: "W5", y: 50 },
      { x: "W6", y: 55 },
      { x: "W7", y: 30 },
      { x: "W8", y: 18 },
    ],
  },
  risk: {
    score: 65,
    label: "Moderate Risk",
    description: "Stable but requires monitoring",
  },
  stats: [
    { label: "Total Seizures (30d)", value: "14" },
    { label: "EEG Sessions", value: "42" },
    { label: "Monitoring Time", value: "1,240 hrs" },
  ],
  alerts: [
    { type: "warning", message: "Increased nocturnal activity detected" },
    { type: "success", message: "Dosage adjustment effective" },
  ],
};
