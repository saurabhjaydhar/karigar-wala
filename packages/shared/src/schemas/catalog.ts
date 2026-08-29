import { z } from "zod";

export const serviceCategoryInputSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  icon: z.string().optional(),
  description: z.string().optional(),
  startingPrice: z.number().min(0),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type ServiceCategoryInput = z.infer<typeof serviceCategoryInputSchema>;

export const areaInputSchema = z.object({
  name: z.string().min(1).max(80),
  city: z.string().min(1).max(80),
  isServiceable: z.boolean().default(true),
});
export type AreaInput = z.infer<typeof areaInputSchema>;

export const serviceInputSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(2).max(80),
  description: z.string().optional(),
  basePrice: z.number().min(0),
});
export type ServiceInput = z.infer<typeof serviceInputSchema>;
