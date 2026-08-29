"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyReviews } from "@/lib/api/reviews";

export function useMyReviews() {
  return useQuery({
    queryKey: ["reviews", "me"],
    queryFn: fetchMyReviews,
  });
}
