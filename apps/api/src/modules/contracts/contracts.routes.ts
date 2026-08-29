import { Router } from "express";
import {
  quoteRequestSchema,
  adminContractQuerySchema,
  adminSendContractQuoteSchema,
  adminUpdateContractStatusSchema,
} from "@karigar-wala/shared";
import { requireAuth, requireAdmin } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { contractsController } from "./contracts.controller";

export const contractsRouter = Router();

contractsRouter.use(requireAuth);
contractsRouter.post(
  "/quote-request",
  validate(quoteRequestSchema),
  contractsController.requestQuote,
);
contractsRouter.get("/me", contractsController.listMine);
contractsRouter.get("/:id", contractsController.getById);
contractsRouter.patch("/:id/accept", contractsController.accept);
contractsRouter.patch("/:id/cancel", contractsController.cancel);

export const adminContractsRouter = Router();
adminContractsRouter.use(requireAdmin);
adminContractsRouter.get(
  "/",
  validate(adminContractQuerySchema, "query"),
  contractsController.adminList,
);
adminContractsRouter.post(
  "/:id/quote",
  validate(adminSendContractQuoteSchema),
  contractsController.adminSendQuote,
);
adminContractsRouter.patch(
  "/:id/status",
  validate(adminUpdateContractStatusSchema),
  contractsController.adminUpdateStatus,
);
