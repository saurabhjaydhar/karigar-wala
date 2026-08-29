import { z } from "zod";

export const karigarTypeEnum = z.enum(["karigar", "contractor"]);
export type KarigarType = z.infer<typeof karigarTypeEnum>;

export const verificationStatusEnum = z.enum(["pending", "approved", "rejected"]);
export type VerificationStatus = z.infer<typeof verificationStatusEnum>;

export const karigarApplicationSchema = z.object({
  type: karigarTypeEnum,
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/),
  photoUrl: z.string().url().optional(),
  primarySkill: z.string().min(2).max(60),
  yearsOfExperience: z.number().int().min(0).max(60),
  teamSize: z.number().int().min(1).optional(),
  areasServed: z.array(z.string()).min(1),
  documentUrls: z.array(z.string().url()).default([]),
});
export type KarigarApplicationInput = z.infer<typeof karigarApplicationSchema>;

export const karigarQuerySchema = z.object({
  area: z.string().optional(),
  category: z.string().optional(),
  q: z.string().optional(),
});
export type KarigarQuery = z.infer<typeof karigarQuerySchema>;

export const updateKarigarStatusSchema = z.object({
  verificationStatus: verificationStatusEnum,
});
export type UpdateKarigarStatusInput = z.infer<typeof updateKarigarStatusSchema>;

export const adminKarigarQuerySchema = z.object({
  status: verificationStatusEnum.optional(),
});
export type AdminKarigarQuery = z.infer<typeof adminKarigarQuerySchema>;

// Sensible-default criteria for a home-services marketplace, matching what
// the plan calls the "4-point verification checklist" — not a legal/compliance
// sign-off, just what an admin confirms before approving a karigar. Review
// and adjust these to the business's actual trust & safety requirements.
export const karigarVerificationChecklistSchema = z.object({
  idVerified: z.boolean(),
  addressVerified: z.boolean(),
  backgroundCheckPassed: z.boolean(),
  skillAssessmentPassed: z.boolean(),
});
export type KarigarVerificationChecklist = z.infer<typeof karigarVerificationChecklistSchema>;

export const updateKarigarChecklistSchema = karigarVerificationChecklistSchema.partial();
export type UpdateKarigarChecklistInput = z.infer<typeof updateKarigarChecklistSchema>;
