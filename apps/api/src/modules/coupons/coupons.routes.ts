import { Router } from "express";
import { validateCouponSchema } from "@karigar-wala/shared";
import { validate } from "../../middlewares/validate";
import { couponsController } from "./coupons.controller";

export const couponsRouter = Router();
couponsRouter.post("/validate", validate(validateCouponSchema), couponsController.validate);
