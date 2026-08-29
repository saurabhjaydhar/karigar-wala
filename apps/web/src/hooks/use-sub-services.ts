"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSubServices } from "@/lib/api/services";

export function useSubServices(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["services", categoryId, "sub-services"],
    queryFn: () => fetchSubServices(categoryId!),
    enabled: Boolean(categoryId),
  });
}
