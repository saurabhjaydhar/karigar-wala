"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentAdmin } from "@/lib/api/auth";

export function useCurrentAdmin() {
  return useQuery({
    queryKey: ["admin-me"],
    queryFn: fetchCurrentAdmin,
    retry: false,
    staleTime: 60_000,
  });
}
