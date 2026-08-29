import { Router } from "express";
import { servicesController } from "./services.controller";

export const servicesRouter = Router();

servicesRouter.get("/", servicesController.list);
servicesRouter.get("/:categoryId/sub-services", servicesController.listSubServices);
servicesRouter.get("/:slug", servicesController.getBySlug);
