"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RequireAuth } from "@/components/features/auth/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { useMyBookings } from "@/hooks/use-my-bookings";
import { useMyReviews } from "@/hooks/use-my-reviews";
import { cancelBooking } from "@/lib/api/bookings";
import { ReviewForm } from "@/components/features/reviews/review-form";
import type { BookingListItem } from "@/types";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  pending: "warning",
  confirmed: "info",
  ongoing: "brand",
  completed: "success",
  cancelled: "danger",
};

const CANCELLABLE_STATUSES = new Set(["pending", "confirmed", "ongoing"]);

function BookingCard({
  booking,
  isReviewed,
}: {
  booking: BookingListItem;
  isReviewed: boolean;
}) {
  const t = useTranslations("bookingsPage");
  const STATUS_LABEL: Record<string, string> = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    ongoing: t("statusOngoing"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
  };
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  // Tracked locally in addition to the `isReviewed` prop (derived from a
  // separate query) so the UI updates immediately on submit rather than
  // waiting on that query's invalidation/refetch to land.
  const [justReviewed, setJustReviewed] = useState(false);
  const reviewed = isReviewed || justReviewed;

  async function handleCancel() {
    setCancelling(true);
    try {
      await cancelBooking(booking._id);
      await queryClient.invalidateQueries({ queryKey: ["bookings", "me"] });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{booking.categoryId.name}</span>
        <Badge variant={STATUS_VARIANT[booking.status] ?? "neutral"}>
          {STATUS_LABEL[booking.status] ?? booking.status}
        </Badge>
      </div>
      <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <MapPin className="size-3.5 shrink-0" />
        {booking.area}
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <CalendarDays className="size-3.5 shrink-0" />
        {new Date(booking.preferredDate).toLocaleDateString()} · {booking.timeSlot}
      </p>
      {!!booking.serviceIds.length && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("services", { names: booking.serviceIds.map((s) => s.name).join(", ") })}
        </p>
      )}
      {booking.karigarId && (
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Avatar name={booking.karigarId.name} className="size-6 text-[10px]" />
          {booking.karigarId.name}
          <span className="flex items-center gap-0.5 text-amber-500">
            <Star className="size-3.5" fill="currentColor" />
            {booking.karigarId.rating.toFixed(1)}
          </span>
        </div>
      )}
      {CANCELLABLE_STATUSES.has(booking.status) && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-1 self-start text-red-600 hover:bg-red-500/10"
          loading={cancelling}
          onClick={handleCancel}
        >
          {cancelling ? t("cancelling") : t("cancelBooking")}
        </Button>
      )}
      {booking.status === "completed" && reviewed && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          {t("reviewed")}
        </p>
      )}
      {booking.status === "completed" && !reviewed && !reviewing && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-1 self-start"
          onClick={() => setReviewing(true)}
        >
          {t("leaveReview")}
        </Button>
      )}
      <AnimatePresence>
        {reviewing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ReviewForm
              bookingId={booking._id}
              onDone={() => {
                setReviewing(false);
                setJustReviewed(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function BookingsList() {
  const t = useTranslations("bookingsPage");
  const tc = useTranslations("common");
  const { data: bookings, isLoading } = useMyBookings();
  const { data: reviews } = useMyReviews();
  const reviewedBookingIds = new Set(reviews?.map((r) => r.bookingId));

  if (isLoading) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        {t("emptyPrefix")}
        <Link href="/book" className="font-medium text-brand-navy-700 underline dark:text-brand-orange-400">
          {tc("bookACarigar")}
        </Link>
        {t("emptySuffix")}
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {bookings.map((booking, i) => (
        <Reveal key={booking._id} delay={Math.min(i * 0.05, 0.3)}>
          <BookingCard booking={booking} isReviewed={reviewedBookingIds.has(booking._id)} />
        </Reveal>
      ))}
    </div>
  );
}

export default function MyBookingsPage() {
  const t = useTranslations("bookingsPage");
  return (
    <RequireAuth>
      {() => (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
          <BookingsList />
        </div>
      )}
    </RequireAuth>
  );
}
