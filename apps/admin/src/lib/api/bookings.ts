import { apiFetch } from "@/lib/api-client";

export interface AdminBooking {
  _id: string;
  categoryId: { _id: string; name: string; slug: string };
  karigarId: { _id: string; name: string; phone: string; rating: number } | null;
  customerId: { _id: string; name?: string; phone: string };
  area: string;
  preferredDate: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

export function fetchAdminBookings(status?: string) {
  const suffix = status ? `?status=${status}` : "";
  return apiFetch<AdminBooking[]>(`/admin/bookings${suffix}`);
}

export function assignBookingKarigar(bookingId: string, karigarId: string) {
  return apiFetch<AdminBooking>(`/admin/bookings/${bookingId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ karigarId }),
  });
}

export function updateBookingStatus(bookingId: string, status: string) {
  return apiFetch<AdminBooking>(`/admin/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
