import { Router } from "express";
import { couponInputSchema } from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import { adminCouponsController } from "./admin-coupons.controller";

export const adminCouponsRouter = Router();
adminCouponsRouter.get("/", adminCouponsController.list);
adminCouponsRouter.post("/", validate(couponInputSchema), adminCouponsController.create);
adminCouponsRouter.patch(
  "/:id",
  validate(couponInputSchema.partial()),
  adminCouponsController.update,
);
adminCouponsRouter.delete("/:id", adminCouponsController.remove);
