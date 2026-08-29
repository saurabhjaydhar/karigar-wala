import type { BookingStatus } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { BookingModel } from "../../db/models/booking.model";
import { KarigarModel } from "../../db/models/karigar.model";
import { recordAuditLog } from "./audit-log";
import { reviewReminderQueue, REVIEW_REMINDER_DELAY_MS } from "../../jobs/queues";

function populated() {
  return BookingModel.find()
    .populate("categoryId", "name slug")
    .populate("karigarId", "name phone rating")
    .populate("customerId", "name phone");
}

export const adminBookingsService = {
  list(status?: BookingStatus) {
    const query = status ? populated().where({ status }) : populated();
    return query.sort({ createdAt: -1 });
  },

  async getById(id: string) {
    const booking = await BookingModel.findById(id)
      .populate("categoryId", "name slug")
      .populate("karigarId", "name phone rating")
      .populate("customerId", "name phone");
    if (!booking) throw new HttpError(404, "Booking not found");
    return booking;
  },

  async assignKarigar(adminId: string, bookingId: string, karigarId: string) {
    const karigar = await KarigarModel.findOne({
      _id: karigarId,
      isActive: true,
      verificationStatus: "approved",
    });
    if (!karigar) throw new HttpError(404, "Karigar not found");

    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { karigarId, status: "confirmed" },
      { returnDocument: "after" },
    )
      .populate("categoryId", "name slug")
      .populate("karigarId", "name phone rating");
    if (!booking) throw new HttpError(404, "Booking not found");

    await recordAuditLog(adminId, "booking.assign", "Booking", bookingId, {
      karigarName: karigar.name,
    });

    return booking;
  },

  async updateStatus(adminId: string, bookingId: string, status: BookingStatus) {
    const existing = await BookingModel.findById(bookingId);
    if (!existing) throw new HttpError(404, "Booking not found");
    const wasCompleted = existing.status === "completed";

    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { returnDocument: "after" },
    )
      .populate("categoryId", "name slug")
      .populate("karigarId", "name phone rating");
    if (!booking) throw new HttpError(404, "Booking not found");

    await recordAuditLog(adminId, `booking.status.${status}`, "Booking", bookingId);

    if (status === "completed" && !wasCompleted) {
      await reviewReminderQueue.add(
        "review-reminder",
        { bookingId },
        { delay: REVIEW_REMINDER_DELAY_MS },
      );
    }

    return booking;
  },
};
