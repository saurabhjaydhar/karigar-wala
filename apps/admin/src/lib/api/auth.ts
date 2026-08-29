import { apiFetch } from "@/lib/api-client";

export interface CurrentAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function adminLogin(input: { email: string; password: string }) {
  return apiFetch<{ admin: CurrentAdmin }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function adminLogout() {
  return apiFetch<void>("/admin/auth/logout", { method: "POST" });
}

export function fetchCurrentAdmin() {
  return apiFetch<{ admin: CurrentAdmin }>("/admin/auth/me");
}
