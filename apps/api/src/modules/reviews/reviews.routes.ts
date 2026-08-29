import { Router } from "express";
import { createReviewSchema } from "@karigar-wala/shared";
import { requireAuth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { reviewsController } from "./reviews.controller";

// Mounted ahead of reviewsRouter on the same "/reviews" path so this stays public.
export const publicReviewsRouter = Router();
publicReviewsRouter.get("/featured", reviewsController.listFeatured);

export const reviewsRouter = Router();
reviewsRouter.use(requireAuth);
reviewsRouter.post("/", validate(createReviewSchema), reviewsController.create);
reviewsRouter.get("/me", reviewsController.listMine);

// Mounted separately under /karigars/:id/reviews (public, no auth needed to read)
export const karigarReviewsRouter = Router({ mergeParams: true });
karigarReviewsRouter.get("/:id/reviews", reviewsController.listForKarigar);
