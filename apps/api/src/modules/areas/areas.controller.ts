import { Request, Response, NextFunction } from "express";
import { areasService } from "./areas.service";

export const areasController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await areasService.list());
    } catch (err) {
      next(err);
    }
  },
};
