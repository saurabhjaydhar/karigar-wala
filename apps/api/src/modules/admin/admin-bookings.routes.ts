import { Router } from "express";
import {
  adminBookingQuerySchema,
  adminAssignKarigarSchema,
  adminUpdateBookingStatusSchema,
} from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import { adminBookingsController } from "./admin-bookings.controller";

export const adminBookingsRouter = Router();

adminBookingsRouter.get(
  "/",
  validate(adminBookingQuerySchema, "query"),
  adminBookingsController.list,
);
adminBookingsRouter.get("/:id", adminBookingsController.getById);
adminBookingsRouter.patch(
  "/:id/assign",
  validate(adminAssignKarigarSchema),
  adminBookingsController.assignKarigar,
);
adminBookingsRouter.patch(
  "/:id/status",
  validate(adminUpdateBookingStatusSchema),
  adminBookingsController.updateStatus,
);
