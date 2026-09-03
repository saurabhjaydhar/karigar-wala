"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  MapPinned,
  Tag,
  Wrench,
  Zap,
  UserCheck,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Input, Select, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useServices } from "@/hooks/use-services";
import { useSubServices } from "@/hooks/use-sub-services";
import { useKarigars } from "@/hooks/use-karigars";
import { useAreas } from "@/hooks/use-areas";
import { useAuthPromptStore } from "@/store/use-auth-prompt-store";
import { createAddress } from "@/lib/api/addresses";
import { createBooking } from "@/lib/api/bookings";
import { validateCoupon, type ValidatedCoupon } from "@/lib/api/coupons";
import { ApiError } from "@/lib/api-client";
import { TIME_SLOTS } from "@/lib/constants";

type KarigarMode = "auto" | "specific";

function SectionHeader({ icon: Icon, children }: { icon: typeof Wrench; children: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      <Icon className="size-3.5" />
      {children}
    </p>
  );
}

export function BookingForm() {
  const t = useTranslations("booking");
  const tc = useTranslations("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const openAuthPrompt = useAuthPromptStore((s) => s.open);

  const { data: categories } = useServices();
  const { data: areas } = useAreas();

  const [categoryId, setCategoryId] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [karigarMode, setKarigarMode] = useState<KarigarMode>("auto");
  const [karigarId, setKarigarId] = useState("");
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = categories?.find((c) => c._id === categoryId);
  const { data: subServices } = useSubServices(categoryId || undefined);
  const { data: karigars } = useKarigars({
    area: karigarMode === "specific" ? area : undefined,
    category: karigarMode === "specific" ? selectedCategory?.name : undefined,
  });

  // Date.now() is impure, so the min-date floor is set as a native DOM
  // attribute after mount instead of computed during render/state.
  const dateInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (dateInputRef.current) {
      dateInputRef.current.min = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
    }
  }, []);

  async function applyCoupon() {
    setCouponError(null);
    setAppliedCoupon(null);
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const coupon = await validateCoupon(couponCode.trim());
      setAppliedCoupon(coupon);
    } catch (err) {
      setCouponError(err instanceof ApiError ? err.message : t("invalidCoupon"));
    } finally {
      setApplyingCoupon(false);
    }
  }

  function validate(): string | null {
    if (!categoryId) return t("chooseServiceType");
    if (!area) return t("chooseArea");
    if (karigarMode === "specific" && !karigarId) return t("chooseKarigar");
    if (!addressLine.trim()) return t("enterAddress");
    if (!city.trim()) return t("enterCity");
    if (!preferredDate) return t("choosePreferredDate");
    if (!timeSlot) return t("chooseTimeSlot");
    return null;
  }

  async function submitBooking() {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const address = await createAddress({
        label: addressLabel || "Home",
        line: addressLine,
        area,
        city,
      });

      await createBooking({
        categoryId,
        serviceIds: selectedServiceIds,
        karigarId: karigarMode === "specific" ? karigarId : undefined,
        autoAssigned: karigarMode === "auto",
        addressId: address._id,
        area,
        preferredDate,
        timeSlot,
        couponCode: appliedCoupon?.code,
      });

      await queryClient.invalidateQueries({ queryKey: ["bookings", "me"] });
      router.push("/my-bookings");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("couldNotCreate"));
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      // Lazy auth: verifying the OTP resumes this exact submission.
      openAuthPrompt(() => submitBooking());
      return;
    }
    void submitBooking();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Reveal>
      <Card className="flex flex-col gap-4">
        <SectionHeader icon={Wrench}>{t("sectionService")}</SectionHeader>
        <Label>
          {t("serviceType")}
          <Select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSelectedServiceIds([]);
            }}
          >
            <option value="">{t("selectService")}</option>
            {categories?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Label>

        <AnimatePresence initial={false}>
          {!!subServices?.length && (
            <motion.fieldset
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 overflow-hidden text-sm"
            >
              <legend className="mb-1 text-foreground/80">{t("whatDoYouNeed")}</legend>
              {subServices.map((service) => {
                const checked = selectedServiceIds.includes(service._id);
                return (
                  <label
                    key={service._id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200",
                      checked
                        ? "border-transparent bg-gradient-to-r from-brand-navy-50 to-brand-orange-50 shadow-sm dark:from-brand-navy-900/40 dark:to-white/[0.04]"
                        : "border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setSelectedServiceIds((prev) =>
                            e.target.checked
                              ? [...prev, service._id]
                              : prev.filter((id) => id !== service._id),
                          )
                        }
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          "flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                          checked
                            ? "border-transparent bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white"
                            : "border-black/20 dark:border-white/25",
                        )}
                      >
                        {checked && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      {service.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {tc("fromLower")} ₹{service.basePrice}
                    </span>
                  </label>
                );
              })}
            </motion.fieldset>
          )}
        </AnimatePresence>

        <Label>
          {tc("area")}
          <Select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">{t("selectYourArea")}</option>
            {areas?.map((a) => (
              <option key={a._id} value={a.name}>
                {a.name}
              </option>
            ))}
          </Select>
        </Label>
      </Card>
      </Reveal>

      <Reveal delay={0.08}>
      <Card className="flex flex-col gap-3">
        <SectionHeader icon={UserCheck}>{t("sectionKarigar")}</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "auto" as const, label: t("autoAssign"), icon: Zap },
              { value: "specific" as const, label: t("chooseSpecificKarigar"), icon: UserCheck },
            ]
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setKarigarMode(option.value)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center text-sm transition-all duration-200",
                karigarMode === option.value
                  ? "border-transparent bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-md shadow-brand-navy-900/20"
                  : "border-black/10 text-foreground/80 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm dark:border-white/10 dark:hover:border-white/20",
              )}
            >
              {karigarMode === option.value && (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white dark:ring-brand-navy-950">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full",
                  karigarMode === option.value
                    ? "bg-white/15 text-white"
                    : "bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300",
                )}
              >
                <option.icon className="size-4.5" />
              </span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
        {karigarMode === "specific" && (
          <Select value={karigarId} onChange={(e) => setKarigarId(e.target.value)}>
            <option value="">{t("selectKarigar")}</option>
            {karigars?.map((k) => (
              <option key={k._id} value={k._id}>
                {k.name} — ⭐ {k.rating.toFixed(1)}
              </option>
            ))}
          </Select>
        )}
      </Card>
      </Reveal>

      <Reveal delay={0.16}>
      <Card className="flex flex-col gap-3">
        <SectionHeader icon={MapPinned}>{t("sectionAddress")}</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          <Label>
            {t("addressLabel")}
            <Input value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} />
          </Label>
          <Label>
            {tc("city")}
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </Label>
        </div>
        <Label>
          {tc("addressLine")}
          <Input
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            placeholder={tc("houseNoStreet")}
          />
        </Label>

        <div className="grid grid-cols-2 gap-3">
          <Label>
            {t("preferredDate")}
            <Input
              ref={dateInputRef}
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </Label>
          <Label>
            {t("timeSlot")}
            <Select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
              <option value="">{t("selectSlot")}</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </Select>
          </Label>
        </div>
      </Card>
      </Reveal>

      <Reveal delay={0.24}>
      <Card className="flex flex-col gap-2">
        <SectionHeader icon={Tag}>{t("sectionCoupon")}</SectionHeader>
        <Label>
          {t("couponCodeOptional")}
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setAppliedCoupon(null);
                setCouponError(null);
              }}
              placeholder={t("couponPlaceholder")}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              disabled={applyingCoupon || !couponCode.trim()}
              onClick={applyCoupon}
            >
              {applyingCoupon ? tc("applying") : tc("apply")}
            </Button>
          </div>
        </Label>
        <AnimatePresence>
          {appliedCoupon && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="size-3.5" />
              {t("applied")}
              {appliedCoupon.type === "percentage"
                ? t("percentOff", { value: appliedCoupon.value })
                : t("amountOff", { value: appliedCoupon.value })}
            </motion.p>
          )}
        </AnimatePresence>
        {couponError && <p className="text-xs text-red-600">{couponError}</p>}
        {!appliedCoupon && !couponError && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("promoHint")}</p>
        )}
      </Card>
      </Reveal>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Reveal delay={0.3}>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="sticky bottom-4 w-full gap-2 shadow-lg shadow-brand-navy-900/20"
        >
          <CalendarCheck className="size-4.5" />
          {submitting ? t("submitting") : t("confirmBooking")}
        </Button>
      </Reveal>
    </form>
  );
}
