import { apiFetch } from "@/lib/api-client";

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice: number;
  isNew: boolean;
  isActive: boolean;
}

export interface AdminArea {
  _id: string;
  name: string;
  city: string;
  isServiceable: boolean;
}

export function fetchCategories() {
  return apiFetch<AdminCategory[]>("/admin/categories");
}

export function createCategory(input: {
  name: string;
  slug: string;
  description?: string;
  startingPrice: number;
}) {
  return apiFetch<AdminCategory>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: string) {
  return apiFetch<void>(`/admin/categories/${id}`, { method: "DELETE" });
}

export function fetchAreas() {
  return apiFetch<AdminArea[]>("/admin/areas");
}

export function createArea(input: { name: string; city: string }) {
  return apiFetch<AdminArea>("/admin/areas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteArea(id: string) {
  return apiFetch<void>(`/admin/areas/${id}`, { method: "DELETE" });
}

export interface AdminService {
  _id: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
}

export function fetchAdminServices() {
  return apiFetch<AdminService[]>("/admin/services");
}

export function createAdminService(input: {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
}) {
  return apiFetch<AdminService>("/admin/services", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteAdminService(id: string) {
  return apiFetch<void>(`/admin/services/${id}`, { method: "DELETE" });
}
