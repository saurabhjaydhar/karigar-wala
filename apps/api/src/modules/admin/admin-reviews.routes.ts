import { Router } from "express";
import { adminReviewsController } from "./admin-reviews.controller";

export const adminReviewsRouter = Router();
adminReviewsRouter.get("/", adminReviewsController.list);
adminReviewsRouter.delete("/:id", adminReviewsController.remove);
