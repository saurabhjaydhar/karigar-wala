import type { Model } from "mongoose";
import { UserModel } from "../../db/models/user.model";
import { KarigarModel } from "../../db/models/karigar.model";
import { BookingModel } from "../../db/models/booking.model";
import { ContractModel } from "../../db/models/contract.model";
import { ReviewModel } from "../../db/models/review.model";
import { CouponModel } from "../../db/models/coupon.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countByField(model: Model<any>, field: string) {
  const rows: { _id: string; count: number }[] = await model.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((r) => [r._id, r.count]));
}

export const adminAnalyticsService = {
  async overview() {
    const [
      totalCustomers,
      karigarsByStatus,
      bookingsByStatus,
      contractsByStatus,
      reviewStats,
      couponStats,
    ] = await Promise.all([
      UserModel.countDocuments(),
      countByField(KarigarModel, "verificationStatus"),
      countByField(BookingModel, "status"),
      countByField(ContractModel, "status"),
      ReviewModel.aggregate([
        { $group: { _id: null, count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      ]),
      CouponModel.aggregate([
        {
          $group: {
            _id: null,
            activeCount: { $sum: { $cond: ["$isActive", 1, 0] } },
            totalRedemptions: { $sum: "$usageCount" },
          },
        },
      ]),
    ]);

    return {
      totalCustomers,
      karigars: {
        approved: karigarsByStatus.approved ?? 0,
        pending: karigarsByStatus.pending ?? 0,
        rejected: karigarsByStatus.rejected ?? 0,
      },
      bookings: {
        pending: bookingsByStatus.pending ?? 0,
        confirmed: bookingsByStatus.confirmed ?? 0,
        ongoing: bookingsByStatus.ongoing ?? 0,
        completed: bookingsByStatus.completed ?? 0,
        cancelled: bookingsByStatus.cancelled ?? 0,
      },
      contracts: {
        quote_requested: contractsByStatus.quote_requested ?? 0,
        quoted: contractsByStatus.quoted ?? 0,
        agreed: contractsByStatus.agreed ?? 0,
        in_progress: contractsByStatus.in_progress ?? 0,
        completed: contractsByStatus.completed ?? 0,
        cancelled: contractsByStatus.cancelled ?? 0,
      },
      reviews: {
        count: reviewStats[0]?.count ?? 0,
        averageRating: reviewStats[0]?.avgRating ? Math.round(reviewStats[0].avgRating * 10) / 10 : 0,
      },
      coupons: {
        active: couponStats[0]?.activeCount ?? 0,
        totalRedemptions: couponStats[0]?.totalRedemptions ?? 0,
      },
    };
  },
};
