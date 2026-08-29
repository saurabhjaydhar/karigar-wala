import { Request, Response, NextFunction } from "express";
import type { ContractStatus } from "@karigar-wala/shared";
import { contractsService } from "./contracts.service";

export const contractsController = {
  async requestQuote(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await contractsService.requestQuote(req.user!.id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await contractsService.listMine(req.user!.id));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await contractsService.getById(req.user!.id, req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await contractsService.accept(req.user!.id, req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await contractsService.cancel(req.user!.id, req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async adminSendQuote(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await contractsService.adminSendQuote(req.admin!.id, req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as ContractStatus | undefined;
      res.json(await contractsService.adminList(status));
    } catch (err) {
      next(err);
    }
  },

  async adminUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(
        await contractsService.adminUpdateStatus(req.admin!.id, req.params.id, req.body.status),
      );
    } catch (err) {
      next(err);
    }
  },
};
