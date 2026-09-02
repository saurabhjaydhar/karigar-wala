import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import { logger } from "./utils/logger";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";

import { authRouter, adminAuthRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { servicesRouter } from "./modules/services/services.routes";
import { areasRouter } from "./modules/areas/areas.routes";
import { pageContentRouter } from "./modules/page-content/page-content.routes";
import { karigarsRouter, karigarApplicationsRouter } from "./modules/karigars/karigars.routes";
import { bookingsRouter } from "./modules/bookings/bookings.routes";
import { contractsRouter, adminContractsRouter } from "./modules/contracts/contracts.routes";
import { reviewsRouter, karigarReviewsRouter, publicReviewsRouter } from "./modules/reviews/reviews.routes";
import { couponsRouter } from "./modules/coupons/coupons.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { bootstrapRouter } from "./modules/bootstrap/bootstrap.routes";

export function createApp() {
  const app = express();

  // Railway (and most PaaS) sit the app behind a reverse proxy that sets
  // X-Forwarded-For; without this, express-rate-limit can't safely derive
  // the real client IP and throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: (process.env.CORS_ORIGIN ?? "").split(",").filter(Boolean),
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  const v1 = express.Router();

  v1.use("/auth", authRouter);
  v1.use("/admin/auth", adminAuthRouter);

  v1.use("/users", usersRouter);
  v1.use("/services", servicesRouter);
  v1.use("/areas", areasRouter);
  v1.use("/content", pageContentRouter);
  v1.use("/karigars", karigarsRouter);
  v1.use("/karigars", karigarReviewsRouter);
  v1.use("/karigar-applications", karigarApplicationsRouter);
  v1.use("/bookings", bookingsRouter);
  v1.use("/contracts", contractsRouter);
  v1.use("/reviews", publicReviewsRouter);
  v1.use("/reviews", reviewsRouter);
  v1.use("/coupons", couponsRouter);
  v1.use("/notifications", notificationsRouter);

  v1.use("/admin", adminRouter);
  v1.use("/admin/contracts", adminContractsRouter);
  v1.use("/bootstrap", bootstrapRouter);

  app.use("/api/v1", v1);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
