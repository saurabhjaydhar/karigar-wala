import { apiFetch } from "@/lib/api-client";

export interface AdminContract {
  _id: string;
  customerId: { _id: string; name?: string; phone: string };
  contractorId: { _id: string; name: string; phone: string; teamSize?: number };
  scopeDescription: string;
  estimatedCost?: number;
  timeline?: string;
  status: string;
  createdAt: string;
}

export function fetchAdminContracts(status?: string) {
  const suffix = status ? `?status=${status}` : "";
  return apiFetch<AdminContract[]>(`/admin/contracts${suffix}`);
}

export function sendContractQuote(id: string, input: { estimatedCost: number; timeline: string }) {
  return apiFetch<AdminContract>(`/admin/contracts/${id}/quote`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateContractStatus(id: string, status: string) {
  return apiFetch<AdminContract>(`/admin/contracts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
