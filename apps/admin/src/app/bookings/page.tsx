"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import {
  fetchAdminBookings,
  assignBookingKarigar,
  updateBookingStatus,
  type AdminBooking,
} from "@/lib/api/bookings";
import { fetchAdminKarigars } from "@/lib/api/karigars";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  pending: "warning",
  confirmed: "success",
  ongoing: "info",
  completed: "neutral",
  cancelled: "danger",
};

const NEXT_STATUS: Record<string, string[]> = {
  confirmed: ["ongoing", "cancelled"],
  ongoing: ["completed", "cancelled"],
};

function AssignControl({ booking }: { booking: AdminBooking }) {
  const queryClient = useQueryClient();
  const [karigarId, setKarigarId] = useState("");
  const { data: karigars } = useQuery({
    queryKey: ["admin-karigars", "approved"],
    queryFn: () => fetchAdminKarigars("approved"),
  });

  async function handleAssign() {
    if (!karigarId) return;
    await assignBookingKarigar(booking._id, karigarId);
    await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        aria-label="Assign karigar"
        value={karigarId}
        onChange={(e) => setKarigarId(e.target.value)}
        className="py-1.5 text-xs"
      >
        <option value="">Assign karigar…</option>
        {karigars?.map((k) => (
          <option key={k._id} value={k._id}>
            {k.name} (⭐ {k.rating.toFixed(1)})
          </option>
        ))}
      </Select>
      <Button variant="primary" size="sm" disabled={!karigarId} onClick={handleAssign}>
        Assign
      </Button>
    </div>
  );
}

function StatusControl({ booking }: { booking: AdminBooking }) {
  const queryClient = useQueryClient();
  const options = NEXT_STATUS[booking.status];
  if (!options) return null;

  async function handleChange(status: string) {
    await updateBookingStatus(booking._id, status);
    await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <Select
      aria-label="Update booking status"
      defaultValue=""
      onChange={(e) => e.target.value && handleChange(e.target.value)}
      className="py-1.5 text-xs"
    >
      <option value="">Move to…</option>
      {options.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </Select>
  );
}

function BookingRow({ booking }: { booking: AdminBooking }) {
  return (
    <tr className="border-b border-black/5 align-top last:border-0 dark:border-white/5">
      <td className="px-4 py-3 font-medium text-foreground">{booking.categoryId.name}</td>
      <td className="px-4 py-3 text-slate-500">{booking.customerId.name ?? booking.customerId.phone}</td>
      <td className="px-4 py-3 text-slate-500">
        {booking.area} · {new Date(booking.preferredDate).toLocaleDateString()} · {booking.timeSlot}
      </td>
      <td className="px-4 py-3">
        <Badge variant={STATUS_VARIANT[booking.status]}>{booking.status}</Badge>
      </td>
      <td className="px-4 py-3">
        {booking.karigarId ? (
          <span className="text-xs text-slate-500">{booking.karigarId.name}</span>
        ) : (
          <AssignControl booking={booking} />
        )}
      </td>
      <td className="px-4 py-3">
        <StatusControl booking={booking} />
      </td>
    </tr>
  );
}

function BookingCard({ booking }: { booking: AdminBooking }) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{booking.categoryId.name}</span>
        <Badge variant={STATUS_VARIANT[booking.status]}>{booking.status}</Badge>
      </div>
      <p className="text-sm text-slate-500">{booking.customerId.name ?? booking.customerId.phone}</p>
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin className="size-3.5 shrink-0" />
        {booking.area}
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <CalendarDays className="size-3.5 shrink-0" />
        {new Date(booking.preferredDate).toLocaleDateString()} · {booking.timeSlot}
      </p>
      {booking.karigarId ? (
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <Star className="size-3.5 shrink-0" />
          {booking.karigarId.name}
        </p>
      ) : (
        <AssignControl booking={booking} />
      )}
      <StatusControl booking={booking} />
    </Card>
  );
}

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => fetchAdminBookings(),
  });

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Bookings without an auto-assigned karigar (no approved match in the area) need manual assignment here."
      />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !bookings?.length ? (
        <p className="mt-4 text-sm text-slate-500">No bookings yet.</p>
      ) : (
        <>
          <Card className="mt-4 hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-4 py-2.5">Service</th>
                    <th className="px-4 py-2.5">Customer</th>
                    <th className="px-4 py-2.5">When</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Karigar</th>
                    <th className="px-4 py-2.5">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <BookingRow key={b._id} booking={b} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {bookings.map((b) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
