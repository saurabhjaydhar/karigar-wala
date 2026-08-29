import { Router } from "express";
import { pageContentInputSchema } from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import { adminContentController } from "./admin-content.controller";

export const adminContentRouter = Router();

adminContentRouter.get("/", adminContentController.list);
adminContentRouter.get("/:slug", adminContentController.getBySlug);
adminContentRouter.patch(
  "/:slug",
  validate(pageContentInputSchema),
  adminContentController.update,
);
