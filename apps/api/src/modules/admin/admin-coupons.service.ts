import type { CouponInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { CouponModel } from "../../db/models/coupon.model";

export const adminCouponsService = {
  list() {
    return CouponModel.find().sort({ createdAt: -1 });
  },

  create(input: CouponInput) {
    return CouponModel.create(input);
  },

  async update(id: string, input: Partial<CouponInput>) {
    const coupon = await CouponModel.findByIdAndUpdate(id, input, { returnDocument: "after" });
    if (!coupon) throw new HttpError(404, "Coupon not found");
    return coupon;
  },

  async remove(id: string) {
    const coupon = await CouponModel.findByIdAndDelete(id);
    if (!coupon) throw new HttpError(404, "Coupon not found");
  },
};
