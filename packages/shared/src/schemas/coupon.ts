import { z } from "zod";

export const validateCouponSchema = z.object({
  code: z.string().min(3).max(20),
});
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;

export const couponTypeEnum = z.enum(["percentage", "flat"]);
export type CouponType = z.infer<typeof couponTypeEnum>;

export const couponInputSchema = z.object({
  code: z.string().min(3).max(20),
  type: couponTypeEnum,
  value: z.number().min(0),
  validFrom: z.string().datetime().or(z.string().date()),
  validTo: z.string().datetime().or(z.string().date()),
  usageLimit: z.number().int().min(1).optional(),
  isActive: z.boolean().default(true),
});
export type CouponInput = z.infer<typeof couponInputSchema>;
