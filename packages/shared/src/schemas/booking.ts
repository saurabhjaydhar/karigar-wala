import { z } from "zod";

export const bookingStatusEnum = z.enum([
  "pending",
  "confirmed",
  "ongoing",
  "completed",
  "cancelled",
]);
export type BookingStatus = z.infer<typeof bookingStatusEnum>;

export const createBookingSchema = z.object({
  categoryId: z.string(),
  serviceIds: z.array(z.string()).default([]),
  karigarId: z.string().nullable().optional(),
  autoAssigned: z.boolean().default(false),
  addressId: z.string(),
  area: z.string(),
  preferredDate: z.string().date(),
  timeSlot: z.string(),
  couponCode: z.string().optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const adminBookingQuerySchema = z.object({
  status: bookingStatusEnum.optional(),
});
export type AdminBookingQuery = z.infer<typeof adminBookingQuerySchema>;

export const adminAssignKarigarSchema = z.object({
  karigarId: z.string(),
});
export type AdminAssignKarigarInput = z.infer<typeof adminAssignKarigarSchema>;

export const adminUpdateBookingStatusSchema = z.object({
  status: bookingStatusEnum,
});
export type AdminUpdateBookingStatusInput = z.infer<typeof adminUpdateBookingStatusSchema>;

export const contractStatusEnum = z.enum([
  "quote_requested",
  "quoted",
  "agreed",
  "in_progress",
  "completed",
  "cancelled",
]);
export type ContractStatus = z.infer<typeof contractStatusEnum>;

export const quoteRequestSchema = z.object({
  contractorId: z.string(),
  scopeDescription: z.string().min(10).max(2000),
  photoUrls: z.array(z.string().url()).default([]),
});
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const adminContractQuerySchema = z.object({
  status: contractStatusEnum.optional(),
});
export type AdminContractQuery = z.infer<typeof adminContractQuerySchema>;

export const adminSendContractQuoteSchema = z.object({
  estimatedCost: z.number().min(0),
  timeline: z.string().min(1).max(200),
});
export type AdminSendContractQuoteInput = z.infer<typeof adminSendContractQuoteSchema>;

export const adminUpdateContractStatusSchema = z.object({
  status: contractStatusEnum,
});
export type AdminUpdateContractStatusInput = z.infer<typeof adminUpdateContractStatusSchema>;
