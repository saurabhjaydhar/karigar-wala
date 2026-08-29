import { Request, Response, NextFunction } from "express";
import { couponsService } from "./coupons.service";

export const couponsController = {
  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await couponsService.validate(req.body));
    } catch (err) {
      next(err);
    }
  },
};
