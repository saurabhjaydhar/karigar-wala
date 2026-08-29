import { Router } from "express";
import { adminAuditController } from "./admin-audit.controller";

export const adminAuditRouter = Router();
adminAuditRouter.get("/", adminAuditController.list);
