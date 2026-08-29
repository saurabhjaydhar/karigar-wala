import { Schema, model, Types } from "mongoose";

export interface AuditLogDocument {
  adminId: Types.ObjectId;
  action: string;
  targetType: string;
  targetId: Types.ObjectId;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const AuditLogModel = model<AuditLogDocument>("AuditLog", auditLogSchema);
