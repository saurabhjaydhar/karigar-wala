import { Schema, model } from "mongoose";

export interface AdminDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: "super_admin" | "admin" | "support";
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "admin", "support"], default: "admin" },
  },
  { timestamps: true },
);

export const AdminModel = model<AdminDocument>("Admin", adminSchema);
