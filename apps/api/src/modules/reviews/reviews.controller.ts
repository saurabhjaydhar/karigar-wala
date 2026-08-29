import { Request, Response, NextFunction } from "express";
import { reviewsService } from "./reviews.service";

export const reviewsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await reviewsService.create(req.user!.id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async listForKarigar(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await reviewsService.listForKarigar(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await reviewsService.listMine(req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  async listFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await reviewsService.listFeatured());
    } catch (err) {
      next(err);
    }
  },
};
