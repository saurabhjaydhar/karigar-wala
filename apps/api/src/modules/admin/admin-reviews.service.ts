import { HttpError } from "../../utils/http-error";
import { ReviewModel } from "../../db/models/review.model";
import { recalculateKarigarRating } from "../reviews/reviews.service";
import { recordAuditLog } from "./audit-log";

export const adminReviewsService = {
  list() {
    return ReviewModel.find()
      .sort({ createdAt: -1 })
      .populate("customerId", "name phone")
      .populate("karigarId", "name");
  },

  async remove(adminId: string, id: string) {
    const review = await ReviewModel.findByIdAndDelete(id);
    if (!review) throw new HttpError(404, "Review not found");
    await recalculateKarigarRating(String(review.karigarId));
    await recordAuditLog(adminId, "review.delete", "Review", id, { rating: review.rating });
  },
};
