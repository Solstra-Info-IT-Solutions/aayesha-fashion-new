import { apiFetch } from "@/lib/api";

export interface CustomerNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  readAt: string | null;
  createdAt: string;
}

export interface NotificationList {
  items: CustomerNotification[];
  unreadCount: number;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function getNotifications(accessToken: string, page = 1) {
  return apiFetch<NotificationList>(`/notifications?page=${page}&limit=30`, {
    accessToken,
  });
}

export function getUnreadNotificationCount(accessToken: string) {
  return apiFetch<{ count: number }>("/notifications/unread-count", {
    accessToken,
  });
}

export function markNotificationRead(id: string, accessToken: string) {
  return apiFetch<unknown>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
    accessToken,
  });
}

export function markAllNotificationsRead(accessToken: string) {
  return apiFetch<unknown>("/notifications/read-all", {
    method: "PATCH",
    accessToken,
  });
}
