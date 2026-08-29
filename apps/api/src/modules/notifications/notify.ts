import { logger } from "../../utils/logger";
import { notificationsRepository } from "./notifications.repository";
import { pushService } from "./push.service";

export async function notifyUser(input: {
  userId: string;
  title: string;
  message: string;
  type: string;
}) {
  const notification = await notificationsRepository.create(input);

  // Push is best-effort — a failed/unconfigured push send should never break
  // the caller's flow (booking creation, contract quoting, etc).
  pushService
    .sendToUser(input.userId, { title: input.title, body: input.message })
    .catch((err) => logger.error({ err, userId: input.userId }, "Push notification failed"));

  return notification;
}
