"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyContracts } from "@/lib/api/contracts";

export function useMyContracts() {
  return useQuery({
    queryKey: ["contracts", "me"],
    queryFn: fetchMyContracts,
  });
}
