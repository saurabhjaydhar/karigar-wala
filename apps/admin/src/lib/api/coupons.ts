import { apiFetch } from "@/lib/api-client";

export interface AdminCoupon {
  _id: string;
  code: string;
  type: "percentage" | "flat";
  value: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export function fetchCoupons() {
  return apiFetch<AdminCoupon[]>("/admin/coupons");
}

export function createCoupon(input: {
  code: string;
  type: "percentage" | "flat";
  value: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
}) {
  return apiFetch<AdminCoupon>("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteCoupon(id: string) {
  return apiFetch<void>(`/admin/coupons/${id}`, { method: "DELETE" });
}
