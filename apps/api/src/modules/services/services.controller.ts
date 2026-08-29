import { Request, Response, NextFunction } from "express";
import { servicesService } from "./services.service";

export const servicesController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await servicesService.list());
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await servicesService.getBySlug(req.params.slug));
    } catch (err) {
      next(err);
    }
  },

  async listSubServices(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await servicesService.listSubServices(req.params.categoryId));
    } catch (err) {
      next(err);
    }
  },
};
