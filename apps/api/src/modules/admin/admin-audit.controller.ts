import { Request, Response, NextFunction } from "express";
import { adminAuditService } from "./admin-audit.service";

export const adminAuditController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminAuditService.list());
    } catch (err) {
      next(err);
    }
  },
};
