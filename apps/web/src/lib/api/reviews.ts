import { apiFetch } from "@/lib/api-client";
import type { CreateReviewInput } from "@karigar-wala/shared";

export interface ReviewItem {
  _id: string;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface KarigarReviewItem extends ReviewItem {
  customerId: { name?: string } | null;
}

export interface FeaturedReviewItem extends ReviewItem {
  customerId: { name?: string } | null;
  karigarId: { name: string; primarySkill: string; photoUrl?: string } | null;
}

export function createReview(input: CreateReviewInput) {
  return apiFetch<ReviewItem>("/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchMyReviews() {
  return apiFetch<ReviewItem[]>("/users/me/reviews");
}

export function fetchKarigarReviews(karigarId: string) {
  return apiFetch<KarigarReviewItem[]>(`/karigars/${karigarId}/reviews`);
}

export function fetchFeaturedReviews() {
  return apiFetch<FeaturedReviewItem[]>("/reviews/featured");
}
