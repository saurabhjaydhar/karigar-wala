import { apiFetch } from "@/lib/api-client";
import type { ServiceCategory, SubService } from "@/types";

export function fetchServices() {
  return apiFetch<ServiceCategory[]>("/services");
}

export function fetchSubServices(categoryId: string) {
  return apiFetch<SubService[]>(`/services/${categoryId}/sub-services`);
}
