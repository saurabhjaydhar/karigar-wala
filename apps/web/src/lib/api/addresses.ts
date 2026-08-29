import { apiFetch } from "@/lib/api-client";
import type { AddressInput } from "@karigar-wala/shared";

export interface AddressRecord {
  _id: string;
  label: string;
  line: string;
  area: string;
  city: string;
}

export function fetchMyAddresses() {
  return apiFetch<AddressRecord[]>("/users/me/addresses");
}

export function createAddress(input: AddressInput) {
  return apiFetch<AddressRecord>("/users/me/addresses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAddress(addressId: string, input: Partial<AddressInput>) {
  return apiFetch<AddressRecord>(`/users/me/addresses/${addressId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteAddress(addressId: string) {
  return apiFetch<void>(`/users/me/addresses/${addressId}`, { method: "DELETE" });
}
