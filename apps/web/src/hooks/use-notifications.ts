"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/lib/api/notifications";

export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled,
    refetchInterval: enabled ? 30_000 : false,
  });
}
