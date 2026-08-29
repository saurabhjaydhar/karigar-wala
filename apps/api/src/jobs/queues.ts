import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export interface OtpSmsJobData {
  phone: string;
  otp: string;
}

export interface ReviewReminderJobData {
  bookingId: string;
}

export const smsQueue = new Queue<OtpSmsJobData>("sms", { connection });
export const reviewReminderQueue = new Queue<ReviewReminderJobData>("review-reminder", {
  connection,
});

export const REVIEW_REMINDER_DELAY_MS = Number(
  process.env.REVIEW_REMINDER_DELAY_MS ?? 24 * 60 * 60 * 1000,
);
