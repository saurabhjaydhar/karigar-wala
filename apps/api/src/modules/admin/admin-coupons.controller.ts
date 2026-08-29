import { Request, Response, NextFunction } from "express";
import { adminCouponsService } from "./admin-coupons.service";

export const adminCouponsController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminCouponsService.list());
    } catch (err) {
      next(err);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await adminCouponsService.create(req.body));
    } catch (err) {
      next(err);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminCouponsService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await adminCouponsService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
