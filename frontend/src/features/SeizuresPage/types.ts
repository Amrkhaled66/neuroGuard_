import type { ReactNode } from "react";

export type SummaryCardItem = {
  title: string;
  value: string;
  subtitle: string;
};

export type PatternCardItem = {
  title: string;
  subtitle: string;
  icon: ReactNode;
};

export type EventTone = "high" | "medium" | "low";

export type EventRow = {
  id: string;
  dateTime: string;
  type: string;
  duration: string;
  trigger: string;
  postictalState: string;
  tone: EventTone;
};
