import { Worker } from "bullmq";
import IORedis from "ioredis";
import { logger } from "../../utils/logger";
import { BookingModel } from "../../db/models/booking.model";
import { ReviewModel } from "../../db/models/review.model";
import { notifyUser } from "../../modules/notifications/notify";
import type { ReviewReminderJobData } from "../queues";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const reviewReminderWorker = new Worker<ReviewReminderJobData>(
  "review-reminder",
  async (job) => {
    const { bookingId } = job.data;

    const booking = await BookingModel.findById(bookingId).populate("categoryId", "name");
    if (!booking || booking.status !== "completed") return;

    const alreadyReviewed = await ReviewModel.exists({ bookingId });
    if (alreadyReviewed) return;

    const categoryName = (booking.categoryId as unknown as { name: string })?.name ?? "your";
    await notifyUser({
      userId: booking.customerId.toString(),
      title: "How was your service?",
      message: `Leave a review for your recent ${categoryName} booking to help other customers.`,
      type: "review_reminder",
    });

    logger.info({ jobId: job.id, bookingId }, "Review reminder notification sent");
  },
  { connection },
);

reviewReminderWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "Review reminder job failed");
});
