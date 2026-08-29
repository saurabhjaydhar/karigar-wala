import { Request, Response, NextFunction } from "express";
import { bookingsService } from "./bookings.service";

export const bookingsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await bookingsService.create(req.user!.id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await bookingsService.listMine(req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await bookingsService.getById(req.user!.id, req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await bookingsService.cancel(req.user!.id, req.params.id));
    } catch (err) {
      next(err);
    }
  },
};
