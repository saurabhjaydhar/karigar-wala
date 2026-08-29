import { AuditLogModel } from "../../db/models/audit-log.model";

export const adminAuditService = {
  list() {
    return AuditLogModel.find().sort({ createdAt: -1 }).limit(200).populate("adminId", "name email");
  },
};
