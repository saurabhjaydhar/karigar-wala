import { apiFetch } from "@/lib/api-client";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function fetchNotifications() {
  return apiFetch<NotificationItem[]>("/notifications");
}

export function markNotificationRead(id: string) {
  return apiFetch<NotificationItem>(`/notifications/${id}/read`, { method: "PATCH" });
}
