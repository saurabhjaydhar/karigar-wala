import { apiFetch } from "@/lib/api-client";
import type { Karigar } from "@/types";

export function fetchKarigars(params: { area?: string; category?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.area) qs.set("area", params.area);
  if (params.category) qs.set("category", params.category);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<Karigar[]>(`/karigars${suffix}`);
}
