"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  HardHat,
  Users,
  TrendingUp,
  ShieldCheck,
  MapPinned,
  Check,
  AlertCircle,
  User,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";
import { submitKarigarApplication } from "@/lib/api/karigar-applications";
import { ApiError } from "@/lib/api-client";
import { useAreas } from "@/hooks/use-areas";
import { cn } from "@/lib/utils";
import type { KarigarType } from "@karigar-wala/shared";

const BENEFITS = [
  { icon: TrendingUp, key: "benefitMoreWork" as const },
  { icon: ShieldCheck, key: "benefitVerified" as const },
  { icon: MapPinned, key: "benefitFlexible" as const },
] as const;

// Single-page form covering the same fields as the plan's 4-step wizard
// (Personal Details → Skill & Experience → Areas Served → Documents), minus
// document upload since no file storage provider is configured yet.
export default function PartnerWithUsPage() {
  const t = useTranslations("partner");
  const tAuth = useTranslations("auth");
  const { data: areas } = useAreas();
  const [type, setType] = useState<KarigarType>("karigar");
  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [areasServed, setAreasServed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleArea(area: string) {
    setAreasServed((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !/^[6-9]\d{9}$/.test(digits) || !primarySkill.trim() || !areasServed.length) {
      setError(t("validationError"));
      return;
    }

    setSubmitting(true);
    try {
      await submitKarigarApplication({
        type,
        name,
        phone: `+91${digits}`,
        primarySkill,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        teamSize: type === "contractor" ? Number(teamSize) || undefined : undefined,
        areasServed,
        documentUrls: [],
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("couldNotSubmit"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="relative mx-auto max-w-2xl px-4 py-16 text-center">
        <BackgroundBubbles />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <span aria-hidden className="absolute -inset-3 -z-10 animate-pulse rounded-full bg-emerald-400/20 blur-xl" />
            <CheckCircle2 className="size-8" />
          </span>
          <h1 className="text-xl font-bold text-foreground">{t("submitted")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("submittedBody")}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackgroundBubbles />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
      />

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, key }) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-2xl border border-black/10 bg-surface p-3.5 dark:border-white/10"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-sm">
              <Icon className="size-4.5" />
            </span>
            <p className="text-sm font-medium text-foreground">{t(key)}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 -z-10 rounded-[2rem] bg-gradient-to-r from-brand-orange-500/15 via-brand-navy-500/10 to-brand-orange-500/15 opacity-70 blur-2xl"
      />
      <Card className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "karigar" as const, label: t("karigarOption"), hint: t("karigarHint"), icon: HardHat },
              { value: "contractor" as const, label: t("contractorOption"), hint: t("contractorHint"), icon: Users },
            ]
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm transition-all duration-200",
                type === option.value
                  ? "border-transparent bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 shadow-md shadow-brand-navy-900/20"
                  : "border-black/10 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm dark:border-white/10 dark:hover:border-white/20",
              )}
            >
              {type === option.value && (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white dark:ring-brand-navy-950">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full transition-colors",
                  type === option.value
                    ? "bg-white/15 text-white"
                    : "bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300",
                )}
              >
                <option.icon className="size-5" />
              </span>
              <span className={cn("font-medium", type === option.value ? "text-white" : "text-foreground")}>
                {option.label}
              </span>
              <span className={cn("text-xs", type === option.value ? "text-white/70" : "text-slate-600 dark:text-slate-400")}>
                {option.hint}
              </span>
            </button>
          ))}
        </div>

        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <User className="size-3.5" />
          {t("sectionPersonal")}
        </p>

        <Label>
          {t("fullName")}
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Label>

        <Label>
          {t("phoneNumber")}
          <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3.5 py-2.5 transition-all focus-within:border-brand-navy-400 focus-within:ring-4 focus-within:ring-brand-navy-400/15 dark:border-white/10 dark:bg-white/[0.04]">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              value={digits}
              onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-slate-400"
              placeholder={tAuth("mobilePlaceholder")}
            />
          </div>
        </Label>

        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <Wrench className="size-3.5" />
          {t("sectionSkill")}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Label>
            {t("primarySkill")}
            <Input
              value={primarySkill}
              onChange={(e) => setPrimarySkill(e.target.value)}
              placeholder={t("primarySkillPlaceholder")}
            />
          </Label>
          <Label>
            {t("yearsOfExperience")}
            <Input
              type="number"
              min={0}
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
          </Label>
        </div>

        {type === "contractor" && (
          <Label>
            {t("teamSize")}
            <Input type="number" min={1} value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
          </Label>
        )}

        <fieldset className="mt-1 flex flex-col gap-2 text-sm">
          <legend className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <MapPinned className="size-3.5" />
            {t("sectionAreas")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {areas?.map((area) => {
              const active = areasServed.includes(area.name);
              return (
                <button
                  key={area._id}
                  type="button"
                  onClick={() => toggleArea(area.name)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-150",
                    active
                      ? "border-transparent bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-sm"
                      : "border-black/10 text-foreground hover:-translate-y-0.5 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20",
                  )}
                >
                  {area.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={submitting} className="gap-2">
          {submitting ? t("submitting") : t("submitApplication")}
          {!submitting && <ArrowRight className="size-4" />}
        </Button>
      </Card>
      </form>
    </div>
  );
}
