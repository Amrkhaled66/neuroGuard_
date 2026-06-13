export type AlertNotification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string | null;
  readAt: string | null;
};

export type AlertsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AlertsStats = {
  avgResponseTimeInSeconds: number | null;
  patientResponseRate: number;
};

export type AlertsResponse = {
  items: AlertNotification[];
  pagination: AlertsPagination;
  stats: AlertsStats;
};

export type AlertListItem = {
  id: number;
  title: string;
  message: string;
  preview: string;
  isRead: boolean;
  createdAt: string | null;
  readAt: string | null;
  timestampLabel: string;
};

export type AlertsDashboard = {
  unreadCount: number;
  totalCount: number;
  items: AlertListItem[];
  stats: AlertsStats;
};
