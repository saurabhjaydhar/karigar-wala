import { Schema, model } from "mongoose";

export interface UserDocument {
  name?: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  isTrusted: boolean;
  isVerified: boolean;
  memberSince: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    photoUrl: { type: String },
    isTrusted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    memberSince: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>("User", userSchema);
