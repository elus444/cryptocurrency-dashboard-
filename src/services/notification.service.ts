import { httpClient } from "@/services/api/http-client";
import type { NotificationDto, NotificationType, PaginatedResult } from "@/types/domain.types";

export const notificationService = {
  async getNotifications(page: number, pageSize: number, type: NotificationType | "all") {
    return httpClient.get<PaginatedResult<NotificationDto>>("/notifications", {
      params: { page, pageSize, type },
    });
  },

  async markAsRead(id: string) {
    await httpClient.patch(`/notifications/${id}/read`);
    return id;
  },

  async markAllAsRead() {
    await httpClient.post("/notifications/mark-all-read");
  },

  async remove(id: string) {
    await httpClient.delete(`/notifications/${id}`);
    return id;
  },
};
