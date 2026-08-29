import { Request, Response, NextFunction } from "express";
import type { BookingStatus } from "@karigar-wala/shared";
import { adminBookingsService } from "./admin-bookings.service";

export const adminBookingsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as BookingStatus | undefined;
      res.json(await adminBookingsService.list(status));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminBookingsService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async assignKarigar(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(
        await adminBookingsService.assignKarigar(req.admin!.id, req.params.id, req.body.karigarId),
      );
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(
        await adminBookingsService.updateStatus(req.admin!.id, req.params.id, req.body.status),
      );
    } catch (err) {
      next(err);
    }
  },
};
