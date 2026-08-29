import { Router } from "express";
import { createBookingSchema } from "@karigar-wala/shared";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { bookingsController } from "./bookings.controller";

export const bookingsRouter = Router();

bookingsRouter.use(requireAuth);

bookingsRouter.post("/", validate(createBookingSchema), bookingsController.create);
bookingsRouter.get("/me", bookingsController.listMine);
bookingsRouter.get("/:id", bookingsController.getById);
bookingsRouter.patch("/:id/cancel", bookingsController.cancel);
