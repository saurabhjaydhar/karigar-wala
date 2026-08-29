import { Schema, model, Types } from "mongoose";

export interface ServiceDocument {
  categoryId: Types.ObjectId;
  name: string;
  description?: string;
  basePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<ServiceDocument>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
  },
  { timestamps: true },
);

export const ServiceModel = model<ServiceDocument>("Service", serviceSchema);
