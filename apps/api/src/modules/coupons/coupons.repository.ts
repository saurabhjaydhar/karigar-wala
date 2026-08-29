import { CouponModel } from "../../db/models/coupon.model";

export const couponsRepository = {
  findByCode(code: string) {
    return CouponModel.findOne({ code: code.toUpperCase() });
  },

  incrementUsage(id: string) {
    return CouponModel.findByIdAndUpdate(id, { $inc: { usageCount: 1 } });
  },
};
