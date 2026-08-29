import { Request, Response, NextFunction } from "express";
import {
  adminCategoriesService,
  adminAreasService,
  adminServicesService,
} from "./admin-catalog.service";

export const adminCategoriesController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminCategoriesService.list());
    } catch (err) {
      next(err);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await adminCategoriesService.create(req.body));
    } catch (err) {
      next(err);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminCategoriesService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await adminCategoriesService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export const adminAreasController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminAreasService.list());
    } catch (err) {
      next(err);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await adminAreasService.create(req.body));
    } catch (err) {
      next(err);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminAreasService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await adminAreasService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export const adminServicesController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminServicesService.list());
    } catch (err) {
      next(err);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await adminServicesService.create(req.body));
    } catch (err) {
      next(err);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await adminServicesService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await adminServicesService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
