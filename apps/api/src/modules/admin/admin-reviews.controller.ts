import { Request, Response, NextFunction } from "express";
import { adminReviewsService } from "./admin-reviews.service";

export const adminReviewsController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminReviewsService.list());
    } catch (err) {
      next(err);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await adminReviewsService.remove(req.admin!.id, req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
