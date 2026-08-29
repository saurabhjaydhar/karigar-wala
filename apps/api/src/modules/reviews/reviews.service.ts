import { Types } from "mongoose";
import { CreateReviewInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { reviewsRepository } from "./reviews.repository";
import { bookingsRepository } from "../bookings/bookings.repository";
import { ReviewModel } from "../../db/models/review.model";
import { KarigarModel } from "../../db/models/karigar.model";

export async function recalculateKarigarRating(karigarId: string) {
  const [stats] = await ReviewModel.aggregate([
    { $match: { karigarId: new Types.ObjectId(karigarId) } },
    { $group: { _id: "$karigarId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await KarigarModel.findByIdAndUpdate(karigarId, {
    rating: stats ? Math.round(stats.avgRating * 10) / 10 : 0,
    reviewCount: stats?.count ?? 0,
  });
}

export const reviewsService = {
  async create(customerId: string, input: CreateReviewInput) {
    const booking = await bookingsRepository.findByIdForCustomer(customerId, input.bookingId);
    if (!booking) throw new HttpError(404, "Booking not found");
    if (booking.status !== "completed") {
      throw new HttpError(400, "You can only review a completed booking");
    }
    if (!booking.karigarId) {
      throw new HttpError(400, "This booking has no assigned karigar to review");
    }

    const existing = await reviewsRepository.findByBookingId(input.bookingId);
    if (existing) throw new HttpError(409, "You already reviewed this booking");

    const karigarRef = booking.karigarId as unknown as { _id: Types.ObjectId } | Types.ObjectId;
    const karigarId = String("_id" in karigarRef ? karigarRef._id : karigarRef);

    const review = await reviewsRepository.create({
      bookingId: input.bookingId,
      customerId,
      karigarId,
      rating: input.rating,
      comment: input.comment,
    });

    await recalculateKarigarRating(karigarId);

    return review;
  },

  listForKarigar(karigarId: string) {
    return reviewsRepository.findForKarigar(karigarId);
  },

  listMine(customerId: string) {
    return reviewsRepository.findForCustomer(customerId);
  },

  listFeatured() {
    return reviewsRepository.findFeatured(6);
  },
};
