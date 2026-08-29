import { apiFetch } from "@/lib/api-client";

export interface AuditLogEntry {
  _id: string;
  adminId: { _id: string; name: string; email: string } | null;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export function fetchAuditLog() {
  return apiFetch<AuditLogEntry[]>("/admin/audit-log");
}
