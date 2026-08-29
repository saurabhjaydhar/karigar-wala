import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth";
import { adminAnalyticsController } from "./admin.controller";
import { adminKarigarsRouter } from "./admin-karigars.routes";
import { adminBookingsRouter } from "./admin-bookings.routes";
import {
  adminCategoriesRouter,
  adminAreasRouter,
  adminServicesRouter,
} from "./admin-catalog.routes";
import { adminCouponsRouter } from "./admin-coupons.routes";
import { adminUsersRouter } from "./admin-users.routes";
import { adminReviewsRouter } from "./admin-reviews.routes";
import { adminAuditRouter } from "./admin-audit.routes";
import { adminContentRouter } from "./admin-content.routes";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.use("/karigars", adminKarigarsRouter);
adminRouter.use("/bookings", adminBookingsRouter);
adminRouter.use("/categories", adminCategoriesRouter);
adminRouter.use("/areas", adminAreasRouter);
adminRouter.use("/coupons", adminCouponsRouter);
adminRouter.use("/users", adminUsersRouter);
adminRouter.use("/reviews", adminReviewsRouter);
adminRouter.use("/audit-log", adminAuditRouter);

adminRouter.use("/services", adminServicesRouter);
adminRouter.use("/content", adminContentRouter);

adminRouter.get("/analytics/overview", adminAnalyticsController.overview);
