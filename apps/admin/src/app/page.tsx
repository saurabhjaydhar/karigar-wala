"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, HardHat, Hourglass, Star, ClipboardList, MessageSquareText, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { fetchAnalyticsOverview } from "@/lib/api/analytics";

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
}) {
  return (
    <Card className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-sm">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}

function BreakdownList({ title, data }: { title: string; data: Record<string, number> }) {
  const total = Object.values(data).reduce((sum, n) => sum + n, 0);
  return (
    <Card>
      <p className="mb-2 text-sm font-medium text-foreground">
        {title} <span className="text-slate-500">({total})</span>
      </p>
      <div className="flex flex-col gap-1 text-sm">
        {Object.entries(data).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between">
            <span className="capitalize text-slate-500">{status.replace(/_/g, " ")}</span>
            <span className="font-medium text-foreground">{count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAnalyticsOverview,
  });

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A snapshot of the platform right now." />
      {isLoading || !data ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile icon={Users} label="Customers" value={data.totalCustomers} />
            <StatTile icon={HardHat} label="Approved karigars" value={data.karigars.approved} />
            <StatTile icon={Hourglass} label="Pending applications" value={data.karigars.pending} />
            <StatTile
              icon={Star}
              label="Average rating"
              value={data.reviews.averageRating ? data.reviews.averageRating.toFixed(1) : "—"}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <BreakdownList title="Bookings" data={data.bookings} />
            <BreakdownList title="Contracts" data={data.contracts} />
            <Card>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                Reviews &amp; Coupons
              </p>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <MessageSquareText className="size-3.5" />
                    Total reviews
                  </span>
                  <span className="font-medium text-foreground">{data.reviews.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Ticket className="size-3.5" />
                    Active coupons
                  </span>
                  <span className="font-medium text-foreground">{data.coupons.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <ClipboardList className="size-3.5" />
                    Coupon redemptions
                  </span>
                  <span className="font-medium text-foreground">{data.coupons.totalRedemptions}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
