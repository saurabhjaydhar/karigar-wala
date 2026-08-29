import { Router } from "express";
import { karigarApplicationSchema, karigarQuerySchema } from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import { karigarsController } from "./karigars.controller";

export const karigarsRouter = Router();

// Public directory browsing
karigarsRouter.get("/", validate(karigarQuerySchema, "query"), karigarsController.list);
karigarsRouter.get("/:id", karigarsController.getById);

// Public "Partner with Us" application wizard submission, mounted separately at /karigar-applications
export const karigarApplicationsRouter = Router();
karigarApplicationsRouter.post(
  "/",
  validate(karigarApplicationSchema),
  karigarsController.submitApplication,
);
