"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAreas } from "@/lib/api/areas";

export function useAreas() {
  return useQuery({
    queryKey: ["areas"],
    queryFn: fetchAreas,
    staleTime: 5 * 60_000,
  });
}
