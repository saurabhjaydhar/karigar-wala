import { Schema, model } from "mongoose";

export interface ServiceCategoryDocument {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  startingPrice: number;
  isNew: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceCategorySchema = new Schema<ServiceCategoryDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String },
    description: { type: String },
    startingPrice: { type: Number, required: true },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  // `isNew` shadows Mongoose's own unsaved-document flag; the plan's data
  // model names it that way and nothing here relies on the built-in flag.
  { timestamps: true, suppressReservedKeysWarning: true },
);

export const ServiceCategoryModel = model<ServiceCategoryDocument>(
  "ServiceCategory",
  serviceCategorySchema,
);
