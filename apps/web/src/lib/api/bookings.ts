import { apiFetch } from "@/lib/api-client";
import type { CreateBookingInput } from "@karigar-wala/shared";
import type { BookingListItem } from "@/types";

export function createBooking(input: CreateBookingInput) {
  return apiFetch<BookingListItem>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchMyBookings() {
  return apiFetch<BookingListItem[]>("/bookings/me");
}

export function cancelBooking(bookingId: string) {
  return apiFetch<BookingListItem>(`/bookings/${bookingId}/cancel`, { method: "PATCH" });
}
