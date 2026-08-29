import "dotenv/config";
import { createApp } from "./app";
import { connectDb } from "./utils/db";
import { logger } from "./utils/logger";
import "./jobs/workers/sms.worker";
import "./jobs/workers/review-reminder.worker";

const port = Number(process.env.PORT ?? 4000);

async function main() {
  await connectDb();

  const app = createApp();
  app.listen(port, () => {
    logger.info(`API listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
