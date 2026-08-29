import { apiFetch } from "@/lib/api-client";
import type { KarigarApplicationInput } from "@karigar-wala/shared";

export function submitKarigarApplication(input: KarigarApplicationInput) {
  return apiFetch<{ id: string; verificationStatus: string }>("/karigar-applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
