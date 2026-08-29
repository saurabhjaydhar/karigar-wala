import { Request, Response, NextFunction } from "express";
import { adminUsersService } from "./admin-users.service";

export const adminUsersController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminUsersService.list(req.query.q as string | undefined));
    } catch (err) {
      next(err);
    }
  },
};
