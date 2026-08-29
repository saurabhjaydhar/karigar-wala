import { Request, Response, NextFunction } from "express";
import { adminContentService } from "./admin-content.service";

export const adminContentController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminContentService.list());
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminContentService.getBySlug(req.params.slug));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminContentService.update(req.admin!.id, req.params.slug, req.body));
    } catch (err) {
      next(err);
    }
  },
};
