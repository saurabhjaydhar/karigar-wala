import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { toPublicUser } from "./user.mapper";

export const usersController = {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(toPublicUser(await usersService.getMe(req.user!.id)));
    } catch (err) {
      next(err);
    }
  },

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(toPublicUser(await usersService.updateMe(req.user!.id, req.body)));
    } catch (err) {
      next(err);
    }
  },

  async listAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await usersService.listAddresses(req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await usersService.createAddress(req.user!.id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await usersService.updateAddress(req.user!.id, req.params.addressId, req.body));
    } catch (err) {
      next(err);
    }
  },

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      await usersService.deleteAddress(req.user!.id, req.params.addressId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async subscribeToPush(req: Request, res: Response, next: NextFunction) {
    try {
      await usersService.subscribeToPush(req.user!.id, req.body);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async unsubscribeFromPush(req: Request, res: Response, next: NextFunction) {
    try {
      await usersService.unsubscribeFromPush(req.user!.id, req.body.endpoint);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
