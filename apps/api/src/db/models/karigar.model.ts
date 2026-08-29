  import { Schema, model } from "mongoose";
import type { KarigarType, VerificationStatus } from "@karigar-wala/shared";

export interface KarigarVerificationChecklist {
  idVerified: boolean;
  addressVerified: boolean;
  backgroundCheckPassed: boolean;
  skillAssessmentPassed: boolean;
}

export interface KarigarDocument {
  name: string;
  phone: string;
  photoUrl?: string;
  type: KarigarType;
  primarySkill: string;
  skills: string[];
  yearsOfExperience: number;
  teamSize?: number;
  areasServed: string[];
  verificationStatus: VerificationStatus;
  verificationChecklist: KarigarVerificationChecklist;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const karigarSchema = new Schema<KarigarDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    photoUrl: { type: String },
    type: { type: String, enum: ["karigar", "contractor"], default: "karigar" },
    primarySkill: { type: String, required: true },
    skills: { type: [String], default: [] },
    yearsOfExperience: { type: Number, required: true },
    teamSize: { type: Number },
    areasServed: { type: [String], default: [] },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verificationChecklist: {
      idVerified: { type: Boolean, default: false },
      addressVerified: { type: Boolean, default: false },
      backgroundCheckPassed: { type: Boolean, default: false },
      skillAssessmentPassed: { type: Boolean, default: false },
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const KarigarModel = model<KarigarDocument>("Karigar", karigarSchema);
