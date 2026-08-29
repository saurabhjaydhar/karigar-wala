import { apiFetch } from "@/lib/api-client";

export interface AnalyticsOverview {
  totalCustomers: number;
  karigars: { approved: number; pending: number; rejected: number };
  bookings: Record<string, number>;
  contracts: Record<string, number>;
  reviews: { count: number; averageRating: number };
  coupons: { active: number; totalRedemptions: number };
}

export function fetchAnalyticsOverview() {
  return apiFetch<AnalyticsOverview>("/admin/analytics/overview");
}
