import { Schema, model } from "mongoose";

export interface AreaDocument {
  name: string;
  city: string;
  isServiceable: boolean;
}

const areaSchema = new Schema<AreaDocument>({
  name: { type: String, required: true },
  city: { type: String, required: true },
  isServiceable: { type: Boolean, default: true },
});
areaSchema.index({ name: 1, city: 1 }, { unique: true });

export const AreaModel = model<AreaDocument>("Area", areaSchema);
