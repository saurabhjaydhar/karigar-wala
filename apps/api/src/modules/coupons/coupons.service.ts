import { ValidateCouponInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { couponsRepository } from "./coupons.repository";
import type { CouponDocument } from "../../db/models/coupon.model";
import type { HydratedDocument } from "mongoose";

export async function findUsableCoupon(code: string): Promise<HydratedDocument<CouponDocument>> {
  const coupon = await couponsRepository.findByCode(code);
  if (!coupon || !coupon.isActive) throw new HttpError(404, "Coupon not found");

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTo) {
    throw new HttpError(400, "This coupon is not currently valid");
  }
  if (coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
    throw new HttpError(400, "This coupon has been fully redeemed");
  }

  return coupon;
}

export const couponsService = {
  async validate({ code }: ValidateCouponInput) {
    const coupon = await findUsableCoupon(code);
    return {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    };
  },
};
