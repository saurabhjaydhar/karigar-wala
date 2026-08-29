import { z } from "zod";

export const pageContentSlugEnum = z.enum(["about-us", "how-it-works", "safety", "faq"]);
export type PageContentSlug = z.infer<typeof pageContentSlugEnum>;

export const pageContentSectionSchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().min(1).max(4000),
});
export type PageContentSection = z.infer<typeof pageContentSectionSchema>;

export const pageContentLocaleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  intro: z.string().max(1000).optional(),
  sections: z.array(pageContentSectionSchema).optional(),
});
export type PageContentLocaleInput = z.infer<typeof pageContentLocaleSchema>;

export const pageContentInputSchema = z.object({
  title: z.string().min(1).max(200),
  intro: z.string().max(1000).optional(),
  sections: z.array(pageContentSectionSchema),
  hi: pageContentLocaleSchema.optional(),
});
export type PageContentInput = z.infer<typeof pageContentInputSchema>;
