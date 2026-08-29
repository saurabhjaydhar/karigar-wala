import { Request, Response, NextFunction } from "express";
import { adminAnalyticsService } from "./admin-analytics.service";

export const adminAnalyticsController = {
  async overview(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminAnalyticsService.overview());
    } catch (err) {
      next(err);
    }
  },
};
