import { NotificationModel } from "../../db/models/notification.model";

export const notificationsRepository = {
  findAllForUser(userId: string) {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 });
  },

  markReadForUser(userId: string, notificationId: string) {
    return NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { returnDocument: "after" },
    );
  },

  create(input: { userId?: string; title: string; message: string; type: string }) {
    return NotificationModel.create(input);
  },
};
