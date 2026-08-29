import { apiFetch } from "@/lib/api-client";

export interface KarigarVerificationChecklist {
  idVerified: boolean;
  addressVerified: boolean;
  backgroundCheckPassed: boolean;
  skillAssessmentPassed: boolean;
}

export interface AdminKarigar {
  _id: string;
  name: string;
  phone: string;
  type: string;
  primarySkill: string;
  yearsOfExperience: number;
  areasServed: string[];
  verificationStatus: "pending" | "approved" | "rejected";
  verificationChecklist: KarigarVerificationChecklist;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export function fetchAdminKarigars(status?: string) {
  const suffix = status ? `?status=${status}` : "";
  return apiFetch<AdminKarigar[]>(`/admin/karigars${suffix}`);
}

export function updateKarigarStatus(id: string, verificationStatus: "approved" | "rejected") {
  return apiFetch<AdminKarigar>(`/admin/karigars/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ verificationStatus }),
  });
}

export function updateKarigarChecklist(id: string, checklist: Partial<KarigarVerificationChecklist>) {
  return apiFetch<AdminKarigar>(`/admin/karigars/${id}/checklist`, {
    method: "PATCH",
    body: JSON.stringify(checklist),
  });
}
