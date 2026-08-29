import { Schema, model, Types } from "mongoose";

export interface ReviewDocument {
  bookingId: Types.ObjectId;
  customerId: Types.ObjectId;
  karigarId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    karigarId: { type: Schema.Types.ObjectId, ref: "Karigar", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ReviewModel = model<ReviewDocument>("Review", reviewSchema);
