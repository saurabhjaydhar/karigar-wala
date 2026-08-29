import { apiFetch } from "@/lib/api-client";

export interface AdminReview {
  _id: string;
  customerId: { _id: string; name?: string; phone: string };
  karigarId: { _id: string; name: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

export function fetchReviews() {
  return apiFetch<AdminReview[]>("/admin/reviews");
}

export function deleteReview(id: string) {
  return apiFetch<void>(`/admin/reviews/${id}`, { method: "DELETE" });
}
