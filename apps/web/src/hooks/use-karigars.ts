"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchKarigars } from "@/lib/api/karigars";

export function useKarigars(params: { area?: string; category?: string }) {
  return useQuery({
    queryKey: ["karigars", params],
    queryFn: () => fetchKarigars(params),
    enabled: Boolean(params.area && params.category),
  });
}
