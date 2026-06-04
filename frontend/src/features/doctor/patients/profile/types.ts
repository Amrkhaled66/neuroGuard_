export type ClinicalItem = {
  label: string;
  value: string;
};

export type MedicationItem = {
  name: string;
  dosage: string;
  status: string;
};

export type StatItem = {
  label: string;
  value: string;
};

export type AlertItem = {
  type: "warning" | "success";
  message: string;
};

export type TrendPoint = {
  x: string;
  y: number;
};

export type ProfileOverviewData = {
  clinicalOverview: ClinicalItem[];
  medications: MedicationItem[];
  trend: {
    percent: number;
    lastSeizure: string;
    points: TrendPoint[];
  };
  risk: {
    score: number;
    label: string;
    description: string;
  };
  stats: StatItem[];
  alerts: AlertItem[];
};
