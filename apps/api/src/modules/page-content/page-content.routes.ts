import { Router } from "express";
import { pageContentController } from "./page-content.controller";

export const pageContentRouter = Router();

pageContentRouter.get("/:slug", pageContentController.getBySlug);
