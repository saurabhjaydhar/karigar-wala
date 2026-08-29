import { CreateBookingInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { bookingsRepository } from "./bookings.repository";
import { addressesRepository } from "../users/addresses.repository";
import { karigarsRepository } from "../karigars/karigars.repository";
import { notifyUser } from "../notifications/notify";
import { couponsRepository } from "../coupons/coupons.repository";
import { findUsableCoupon } from "../coupons/coupons.service";
import { ServiceCategoryModel } from "../../db/models/service-category.model";
import { ServiceModel } from "../../db/models/service.model";
import { KarigarModel } from "../../db/models/karigar.model";

const CANCELLABLE_STATUSES = new Set(["pending", "confirmed", "ongoing"]);

export const bookingsService = {
  async create(customerId: string, input: CreateBookingInput) {
    const [address, category] = await Promise.all([
      addressesRepository.findByIdForUser(customerId, input.addressId),
      ServiceCategoryModel.findOne({ _id: input.categoryId, isActive: true }),
    ]);
    if (!address) throw new HttpError(404, "Address not found");
    if (!category) throw new HttpError(404, "Service category not found");

    if (input.serviceIds.length) {
      const matching = await ServiceModel.countDocuments({
        _id: { $in: input.serviceIds },
        categoryId: category.id,
      });
      if (matching !== input.serviceIds.length) {
        throw new HttpError(400, "One or more selected services are invalid for this category");
      }
    }

    // Re-validate server-side even though the frontend already checked via
    // /coupons/validate — never trust a client-supplied discount.
    const coupon = input.couponCode ? await findUsableCoupon(input.couponCode) : null;

    let karigarId: string | undefined;
    let status: "pending" | "confirmed" = "pending";

    if (input.karigarId) {
      const karigar = await KarigarModel.findOne({
        _id: input.karigarId,
        isActive: true,
        verificationStatus: "approved",
      });
      if (!karigar) throw new HttpError(404, "Karigar not found");
      karigarId = karigar.id;
      status = "confirmed";
    } else if (input.autoAssigned) {
      // Simplified auto-assign: highest-rated approved karigar whose primary
      // skill matches the category name and who serves the requested area.
      // Real load-balancing/availability weighting is future work.
      const [best] = await karigarsRepository.findApproved({
        area: input.area,
        category: category.name,
      });
      if (best) {
        karigarId = best.id;
        status = "confirmed";
      }
    }

    const booking = await bookingsRepository.create({
      ...input,
      customerId,
      karigarId,
      status,
    });

    if (coupon) {
      await couponsRepository.incrementUsage(coupon.id);
    }

    await notifyUser({
      userId: customerId,
      title: status === "confirmed" ? "Booking confirmed" : "Booking received",
      message:
        status === "confirmed"
          ? `Your ${category.name} booking for ${input.preferredDate} is confirmed.`
          : `Your ${category.name} booking is pending — we're finding you a karigar.`,
      type: "booking",
    });

    return booking;
  },

  listMine(customerId: string) {
    return bookingsRepository.findAllForCustomer(customerId);
  },

  async getById(customerId: string, bookingId: string) {
    const booking = await bookingsRepository.findByIdForCustomer(customerId, bookingId);
    if (!booking) throw new HttpError(404, "Booking not found");
    return booking;
  },

  async cancel(customerId: string, bookingId: string) {
    const booking = await bookingsRepository.findByIdForCustomer(customerId, bookingId);
    if (!booking) throw new HttpError(404, "Booking not found");
    if (!CANCELLABLE_STATUSES.has(booking.status)) {
      throw new HttpError(400, `Cannot cancel a booking that is already ${booking.status}`);
    }
    booking.status = "cancelled";
    await booking.save();
    return booking;
  },
};
