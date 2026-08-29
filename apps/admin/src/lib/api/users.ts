import { apiFetch } from "@/lib/api-client";

export interface AdminUser {
  _id: string;
  name?: string;
  phone: string;
  email?: string;
  isTrusted: boolean;
  isVerified: boolean;
  memberSince: string;
}

export function fetchUsers(q?: string) {
  const suffix = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetch<AdminUser[]>(`/admin/users${suffix}`);
}
