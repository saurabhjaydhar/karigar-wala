import { apiFetch } from "@/lib/api-client";

export interface ValidatedCoupon {
  code: string;
  type: "percentage" | "flat";
  value: number;
}

export function validateCoupon(code: string) {
  return apiFetch<ValidatedCoupon>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}
