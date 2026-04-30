export type NotificationStatus = "read" | "sent" | "unread";

export type NotificationItem = {
  id: string;
  title: string;
  data: string;
  message: string;
  status: NotificationStatus;

  source: string;
};

export type HealthMetric = {
  id: string;
  label: string;
  value: string;
  progress: number;
};
