"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Ticket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Select, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { fetchCoupons, createCoupon, deleteCoupon, type AdminCoupon } from "@/lib/api/coupons";
import { ApiError } from "@/lib/api-client";

function couponStatusBadge(coupon: AdminCoupon) {
  const isExpired = new Date(coupon.validTo).getTime() < Date.now();
  const isExhausted = coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit;
  if (isExpired) return <Badge variant="warning">Expired</Badge>;
  if (isExhausted) return <Badge variant="warning">Exhausted</Badge>;
  return null;
}

function CouponRow({ coupon, onDelete }: { coupon: AdminCoupon; onDelete: (id: string) => void }) {
  return (
    <tr className="border-b border-black/5 align-top last:border-0 dark:border-white/5">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium text-foreground">{coupon.code}</span>
          {couponStatusBadge(coupon)}
        </div>
      </td>
      <td className="px-4 py-3 text-slate-500">
        {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
      </td>
      <td className="px-4 py-3 text-slate-500">
        {new Date(coupon.validFrom).toLocaleDateString()} – {new Date(coupon.validTo).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-slate-500">
        {coupon.usageCount}
        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
      </td>
      <td className="px-4 py-3">
        <Button variant="danger" size="sm" onClick={() => onDelete(coupon._id)}>
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </td>
    </tr>
  );
}

function CouponCard({ coupon, onDelete }: { coupon: AdminCoupon; onDelete: (id: string) => void }) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono font-medium text-foreground">{coupon.code}</span>
        {couponStatusBadge(coupon)}
      </div>
      <p className="text-sm text-slate-500">
        {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
      </p>
      <p className="text-sm text-slate-500">
        {new Date(coupon.validFrom).toLocaleDateString()} – {new Date(coupon.validTo).toLocaleDateString()}
      </p>
      <p className="text-sm text-slate-500">
        {coupon.usageCount}
        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""} used
      </p>
      <Button variant="danger" size="sm" className="self-start" onClick={() => onDelete(coupon._id)}>
        <Trash2 className="size-3.5" />
        Delete
      </Button>
    </Card>
  );
}

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: fetchCoupons,
  });

  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "flat">("percentage");
  const [value, setValue] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createCoupon({
        code,
        type,
        value: Number(value) || 0,
        validFrom: new Date(validFrom).toISOString(),
        validTo: new Date(validTo).toISOString(),
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
      });
      setCode("");
      setValue("");
      setValidFrom("");
      setValidTo("");
      setUsageLimit("");
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create coupon");
    }
  }

  async function handleDelete(id: string) {
    await deleteCoupon(id);
    await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
  }

  return (
    <div>
      <PageHeader title="Coupons" subtitle="Create and manage discount codes." />

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <>
          <Card className="mt-4 hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-4 py-2.5">Code</th>
                    <th className="px-4 py-2.5">Discount</th>
                    <th className="px-4 py-2.5">Valid</th>
                    <th className="px-4 py-2.5">Usage</th>
                    <th className="px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons?.map((c) => (
                    <CouponRow key={c._id} coupon={c} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {coupons?.map((c) => (
              <CouponCard key={c._id} coupon={c} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}

      <Card className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <Ticket className="size-4 text-brand-navy-600 dark:text-brand-navy-300" />
          <h2 className="text-sm font-semibold text-foreground">New coupon</h2>
        </div>
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
          <Label className="w-32">
            Code
            <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          </Label>
          <Label className="w-36">
            Type
            <Select value={type} onChange={(e) => setType(e.target.value as "percentage" | "flat")}>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat (₹)</option>
            </Select>
          </Label>
          <Label className="w-24">
            Value
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          </Label>
          <Label className="w-40">
            Valid from
            <Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
          </Label>
          <Label className="w-40">
            Valid to
            <Input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} />
          </Label>
          <Label className="w-28">
            Usage limit
            <Input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Unlimited"
            />
          </Label>
          <Button type="submit" size="sm">
            <Plus className="size-3.5" />
            Add coupon
          </Button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Card>
    </div>
  );
}
