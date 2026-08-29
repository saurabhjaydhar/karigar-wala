import { CreateBookingInput } from "@karigar-wala/shared";
import { BookingModel } from "../../db/models/booking.model";

export interface CreateBookingData extends CreateBookingInput {
  customerId: string;
  karigarId?: string;
  status: "pending" | "confirmed";
}

export const bookingsRepository = {
  create(data: CreateBookingData) {
    return BookingModel.create(data);
  },

  findAllForCustomer(customerId: string) {
    return BookingModel.find({ customerId })
      .sort({ createdAt: -1 })
      .populate("categoryId", "name slug")
      .populate("karigarId", "name phone rating")
      .populate("serviceIds", "name basePrice");
  },

  findByIdForCustomer(customerId: string, bookingId: string) {
    return BookingModel.findOne({ _id: bookingId, customerId })
      .populate("categoryId", "name slug")
      .populate("karigarId", "name phone rating")
      .populate("serviceIds", "name basePrice");
  },
};
