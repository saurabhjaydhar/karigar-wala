import { Router } from "express";
import { adminUsersController } from "./admin-users.controller";

export const adminUsersRouter = Router();
adminUsersRouter.get("/", adminUsersController.list);
