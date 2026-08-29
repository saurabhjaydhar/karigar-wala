import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().optional(),
  photoUrl: z.string().url().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const addressSchema = z.object({
  label: z.string().min(1).max(40),
  line: z.string().min(1).max(200),
  area: z.string().min(1).max(80),
  city: z.string().min(1).max(80),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const pushSubscriptionInputSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionInputSchema>;
