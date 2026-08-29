import webpush from "web-push";
import { logger } from "../../utils/logger";
import { PushSubscriptionModel } from "../../db/models/push-subscription.model";
import type { PushSubscriptionInput } from "@karigar-wala/shared";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

const configured = Boolean(vapidPublicKey && vapidPrivateKey);
if (configured) {
  webpush.setVapidDetails(
    "mailto:support@karigarsaathi.dev",
    vapidPublicKey!,
    vapidPrivateKey!,
  );
} else {
  logger.warn(
    "VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY not set — web push notifications are disabled",
  );
}

export const pushService = {
  isConfigured() {
    return configured;
  },

  async subscribe(userId: string, input: PushSubscriptionInput) {
    return PushSubscriptionModel.findOneAndUpdate(
      { endpoint: input.endpoint },
      { userId, endpoint: input.endpoint, keys: input.keys },
      { upsert: true, returnDocument: "after" },
    );
  },

  async unsubscribe(userId: string, endpoint: string) {
    await PushSubscriptionModel.deleteOne({ userId, endpoint });
  },

  async sendToUser(userId: string, payload: { title: string; body: string }) {
    if (!configured) return;

    const subscriptions = await PushSubscriptionModel.find({ userId });
    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            JSON.stringify(payload),
          );
        } catch (err) {
          const statusCode = (err as { statusCode?: number }).statusCode;
          if (statusCode === 404 || statusCode === 410) {
            // Subscription expired or was revoked by the browser — clean it up.
            await PushSubscriptionModel.deleteOne({ _id: sub._id });
          } else {
            logger.error({ err, userId }, "Failed to send push notification");
          }
        }
      }),
    );
  },
};
