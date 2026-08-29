import { Router } from "express";
import {
  updateKarigarStatusSchema,
  adminKarigarQuerySchema,
  updateKarigarChecklistSchema,
} from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import { adminKarigarsController } from "./admin-karigars.controller";

export const adminKarigarsRouter = Router();

adminKarigarsRouter.get(
  "/",
  validate(adminKarigarQuerySchema, "query"),
  adminKarigarsController.list,
);
adminKarigarsRouter.get("/:id", adminKarigarsController.getById);
adminKarigarsRouter.patch(
  "/:id",
  validate(updateKarigarStatusSchema),
  adminKarigarsController.updateStatus,
);
adminKarigarsRouter.patch(
  "/:id/checklist",
  validate(updateKarigarChecklistSchema),
  adminKarigarsController.updateChecklist,
);
