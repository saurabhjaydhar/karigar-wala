import { Request, Response, NextFunction } from "express";
import type { VerificationStatus } from "@karigar-wala/shared";
import { adminKarigarsService } from "./admin-karigars.service";

export const adminKarigarsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as VerificationStatus | undefined;
      res.json(await adminKarigarsService.list(status));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminKarigarsService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(
        await adminKarigarsService.updateStatus(
          req.admin!.id,
          req.params.id,
          req.body.verificationStatus,
        ),
      );
    } catch (err) {
      next(err);
    }
  },

  async updateChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(
        await adminKarigarsService.updateChecklist(req.admin!.id, req.params.id, req.body),
      );
    } catch (err) {
      next(err);
    }
  },
};
