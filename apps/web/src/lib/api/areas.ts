import { apiFetch } from "@/lib/api-client";
import type { Area } from "@/types";

export function fetchAreas() {
  return apiFetch<Area[]>("/areas");
}
