import { Request, Response, NextFunction } from "express";
import { KarigarQuery } from "@karigar-wala/shared";
import { karigarsService } from "./karigars.service";

export const karigarsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await karigarsService.list(req.query as unknown as KarigarQuery));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await karigarsService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async submitApplication(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await karigarsService.submitApplication(req.body));
    } catch (err) {
      next(err);
    }
  },
};
