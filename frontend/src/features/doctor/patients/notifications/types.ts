export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationStats {
  avgResponseTimeInSeconds: number | null;
  patientResponseRate: number;
}

export interface PatientNotificationsResponse {
  items: NotificationItem[];
  pagination: NotificationPagination;
  stats: NotificationStats;
}
