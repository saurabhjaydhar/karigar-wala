import { HttpError } from "../../utils/http-error";
import { notificationsRepository } from "./notifications.repository";

export const notificationsService = {
  listForUser(userId: string) {
    return notificationsRepository.findAllForUser(userId);
  },

  async markRead(userId: string, notificationId: string) {
    const notification = await notificationsRepository.markReadForUser(userId, notificationId);
    if (!notification) throw new HttpError(404, "Notification not found");
    return notification;
  },
};
