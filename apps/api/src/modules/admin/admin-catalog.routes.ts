import { Router } from "express";
import { serviceCategoryInputSchema, areaInputSchema, serviceInputSchema } from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import {
  adminCategoriesController,
  adminAreasController,
  adminServicesController,
} from "./admin-catalog.controller";

export const adminCategoriesRouter = Router();
adminCategoriesRouter.get("/", adminCategoriesController.list);
adminCategoriesRouter.post(
  "/",
  validate(serviceCategoryInputSchema),
  adminCategoriesController.create,
);
adminCategoriesRouter.patch(
  "/:id",
  validate(serviceCategoryInputSchema.partial()),
  adminCategoriesController.update,
);
adminCategoriesRouter.delete("/:id", adminCategoriesController.remove);

export const adminAreasRouter = Router();
adminAreasRouter.get("/", adminAreasController.list);
adminAreasRouter.post("/", validate(areaInputSchema), adminAreasController.create);
adminAreasRouter.patch(
  "/:id",
  validate(areaInputSchema.partial()),
  adminAreasController.update,
);
adminAreasRouter.delete("/:id", adminAreasController.remove);

export const adminServicesRouter = Router();
adminServicesRouter.get("/", adminServicesController.list);
adminServicesRouter.post("/", validate(serviceInputSchema), adminServicesController.create);
adminServicesRouter.patch(
  "/:id",
  validate(serviceInputSchema.partial()),
  adminServicesController.update,
);
adminServicesRouter.delete("/:id", adminServicesController.remove);
