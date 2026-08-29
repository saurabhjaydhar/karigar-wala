"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyBookings } from "@/lib/api/bookings";

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "me"],
    queryFn: fetchMyBookings,
  });
}
