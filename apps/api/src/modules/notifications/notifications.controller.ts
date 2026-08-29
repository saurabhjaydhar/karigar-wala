import { Request, Response, NextFunction } from "express";
import { notificationsService } from "./notifications.service";

export const notificationsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await notificationsService.listForUser(req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await notificationsService.markRead(req.user!.id, req.params.id));
    } catch (err) {
      next(err);
    }
  },
};
