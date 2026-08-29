import { ReviewModel } from "../../db/models/review.model";

export const reviewsRepository = {
  create(input: { bookingId: string; customerId: string; karigarId: string; rating: number; comment?: string }) {
    return ReviewModel.create(input);
  },

  findForKarigar(karigarId: string) {
    return ReviewModel.find({ karigarId }).sort({ createdAt: -1 }).populate("customerId", "name");
  },

  findForCustomer(customerId: string) {
    return ReviewModel.find({ customerId }).sort({ createdAt: -1 }).populate("karigarId", "name");
  },

  findByBookingId(bookingId: string) {
    return ReviewModel.findOne({ bookingId });
  },

  findFeatured(limit: number) {
    return ReviewModel.find({ rating: { $gte: 4 }, comment: { $exists: true, $ne: "" } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .populate("customerId", "name")
      .populate("karigarId", "name primarySkill photoUrl");
  },
};
