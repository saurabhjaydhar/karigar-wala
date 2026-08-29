import { apiFetch } from "@/lib/api-client";
import type { QuoteRequestInput, ContractStatus } from "@karigar-wala/shared";

export interface ContractItem {
  _id: string;
  contractorId: { _id: string; name: string; phone: string; teamSize?: number };
  scopeDescription: string;
  photoUrls: string[];
  estimatedCost?: number;
  timeline?: string;
  status: ContractStatus;
  createdAt: string;
}

export function requestQuote(input: QuoteRequestInput) {
  return apiFetch<ContractItem>("/contracts/quote-request", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchMyContracts() {
  return apiFetch<ContractItem[]>("/contracts/me");
}

export function acceptContract(id: string) {
  return apiFetch<ContractItem>(`/contracts/${id}/accept`, { method: "PATCH" });
}

export function cancelContract(id: string) {
  return apiFetch<ContractItem>(`/contracts/${id}/cancel`, { method: "PATCH" });
}
