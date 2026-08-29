import { Schema, model, Types } from "mongoose";
import type { ContractStatus } from "@karigar-wala/shared";

export interface ContractMilestone {
  title: string;
  amount: number;
  status: string;
}

export interface ContractDocument {
  customerId: Types.ObjectId;
  contractorId: Types.ObjectId;
  scopeDescription: string;
  photoUrls: string[];
  estimatedCost?: number;
  timeline?: string;
  milestones: ContractMilestone[];
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contractSchema = new Schema<ContractDocument>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contractorId: { type: Schema.Types.ObjectId, ref: "Karigar", required: true },
    scopeDescription: { type: String, required: true },
    photoUrls: { type: [String], default: [] },
    estimatedCost: { type: Number },
    timeline: { type: String },
    milestones: { type: Schema.Types.Mixed, default: [] },
    status: {
      type: String,
      enum: ["quote_requested", "quoted", "agreed", "in_progress", "completed", "cancelled"],
      default: "quote_requested",
    },
  },
  { timestamps: true },
);

export const ContractModel = model<ContractDocument>("Contract", contractSchema);
