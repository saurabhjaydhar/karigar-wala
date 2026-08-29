import { AuditLogModel } from "../../db/models/audit-log.model";

export function recordAuditLog(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
) {
  return AuditLogModel.create({ adminId, action, targetType, targetId, details });
}
