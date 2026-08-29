"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api/services";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 5 * 60_000,
  });
}
