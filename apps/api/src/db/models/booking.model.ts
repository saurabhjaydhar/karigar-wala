import { Schema, model, Types } from "mongoose";
import type { BookingStatus } from "@karigar-wala/shared";

export interface BookingDocument {
  customerId: Types.ObjectId;
  karigarId?: Types.ObjectId;
  categoryId: Types.ObjectId;
  serviceIds: Types.ObjectId[];
  addressId: Types.ObjectId;
  area: string;
  preferredDate: Date;
  timeSlot: string;
  autoAssigned: boolean;
  status: BookingStatus;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    karigarId: { type: Schema.Types.ObjectId, ref: "Karigar" },
    categoryId: { type: Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    serviceIds: { type: [Schema.Types.ObjectId], ref: "Service", default: [] },
    addressId: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    area: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    autoAssigned: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    couponCode: { type: String },
  },
  { timestamps: true },
);

export const BookingModel = model<BookingDocument>("Booking", bookingSchema);
