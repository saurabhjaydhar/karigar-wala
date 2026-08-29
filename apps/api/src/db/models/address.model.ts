import { Schema, model, Types } from "mongoose";

export interface AddressDocument {
  userId: Types.ObjectId;
  label: string;
  line: string;
  area: string;
  city: string;
  lat?: number;
  lng?: number;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<AddressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, required: true },
    line: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true },
);

export const AddressModel = model<AddressDocument>("Address", addressSchema);
