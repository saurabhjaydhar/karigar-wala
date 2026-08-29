import { Request, Response, NextFunction } from "express";
import { pageContentService } from "./page-content.service";

export const pageContentController = {
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const locale = typeof req.query.locale === "string" ? req.query.locale : undefined;
      res.json(await pageContentService.getBySlug(req.params.slug, locale));
    } catch (err) {
      next(err);
    }
  },
};
