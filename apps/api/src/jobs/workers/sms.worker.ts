import { Worker } from "bullmq";
import IORedis from "ioredis";
import { logger } from "../../utils/logger";
import { sendOtpSms } from "../../modules/auth/sms.provider";
import type { OtpSmsJobData } from "../queues";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const smsWorker = new Worker<OtpSmsJobData>(
  "sms",
  async (job) => {
    await sendOtpSms(job.data.phone, job.data.otp);
    logger.info({ jobId: job.id, phone: job.data.phone }, "OTP SMS job processed");
  },
  { connection },
);

smsWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "OTP SMS job failed");
});
