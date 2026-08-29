import { Router } from "express";
import { areasController } from "./areas.controller";

export const areasRouter = Router();

areasRouter.get("/", areasController.list);
