import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { notificationsController } from "./notifications.controller";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);
notificationsRouter.get("/", notificationsController.list);
notificationsRouter.patch("/:id/read", notificationsController.markRead);
