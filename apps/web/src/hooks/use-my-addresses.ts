"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyAddresses } from "@/lib/api/addresses";

export function useMyAddresses() {
  return useQuery({
    queryKey: ["addresses", "me"],
    queryFn: fetchMyAddresses,
  });
}
