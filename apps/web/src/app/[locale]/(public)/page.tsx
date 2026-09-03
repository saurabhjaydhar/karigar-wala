import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ShieldCheck, Star, BadgeCheck, Wallet, Sparkles, ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SectionError } from "@/components/ui/section-error";
import { CategoryIcon } from "@/lib/category-icons";
import { getCategoryImage } from "@/lib/category-images";
import { HeroVisual } from "@/components/features/home/hero-visual";
import { CouponBanner } from "@/components/features/home/coupon-banner";
import { CustomerFeedback } from "@/components/features/home/customer-feedback";
import { HomeSafety } from "@/components/features/home/home-safety";
import { KarigarCard } from "@/components/features/karigar-card/karigar-card";
import { apiFetch } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { FeaturedReviewItem } from "@/lib/api/reviews";
import type { Karigar, ServiceCategory } from "@/types";

const FEATURED_KARIGAR_COUNT = 4;

export const dynamic = "force-dynamic";

const TRUST_ITEMS = [
  { icon: ShieldCheck, prefix: "50+" as const, prefixKey: null, captionKey: "trustVerified" as const },
  { icon: Star, prefix: "4.8" as const, prefixKey: null, captionKey: "trustRating" as const },
  { icon: BadgeCheck, prefix: null, prefixKey: "pointVerified" as const, captionKey: null },
  { icon: Wallet, prefix: "₹0" as const, prefixKey: null, captionKey: "trustNoAdvance" as const },
] as const;

const CATEGORY_ACCENTS = [
  { icon: "from-brand-navy-600 to-brand-navy-800", tint: "from-brand-navy-50/70 dark:from-white/[0.04]", ring: "shadow-brand-navy-900/25", bar: "from-brand-navy-500 to-brand-navy-700" },
  { icon: "from-brand-orange-500 to-brand-orange-600", tint: "from-brand-orange-50/70 dark:from-white/[0.04]", ring: "shadow-brand-orange-600/25", bar: "from-brand-orange-400 to-brand-orange-600" },
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const [categoriesResult, karigarsResult, feedbackResult] = await Promise.allSettled([
    apiFetch<ServiceCategory[]>("/services"),
    apiFetch<Karigar[]>("/karigars"),
    apiFetch<FeaturedReviewItem[]>("/reviews/featured"),
  ]);
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const karigars = karigarsResult.status === "fulfilled" ? karigarsResult.value : null;
  const feedback = feedbackResult.status === "fulfilled" ? feedbackResult.value : [];
  const featuredKarigars = karigars?.slice(0, FEATURED_KARIGAR_COUNT) ?? [];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-3 sm:gap-12 sm:px-6 sm:py-12 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-brand-orange-500/25 via-brand-navy-500/20 to-brand-orange-500/25 opacity-60 blur-2xl"
        />
        <div className="relative isolate overflow-hidden rounded-3xl">
        <Image
          src="/hero-team.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-105 saturate-110"
        />
        {/* Flat tint (mix-blend-multiply) gives every piece of text a consistent,
            predictable backdrop regardless of what's underneath, instead of only
            the gradient's darker band — the gradient alone left the top of the
            image unprotected, which is why text could blend into the photo. */}
        <div className="absolute inset-0 bg-brand-navy-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/40 via-transparent to-transparent" />

        <Sparkles
          aria-hidden
          className="pointer-events-none absolute right-[10%] top-[12%] size-5 animate-float text-brand-orange-300/70 sm:right-[14%] sm:size-6"
        />
        <Sparkles
          aria-hidden
          className="pointer-events-none absolute right-[22%] top-[30%] size-3 animate-float-slow text-white/50"
        />

        <Card
          variant="glass"
          className="relative grid gap-3 !rounded-3xl !border-white/10 !bg-brand-navy-950/5 px-4 py-4 !backdrop-blur-none shadow-2xl shadow-black/40 sm:gap-6 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-16 lg:py-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
          <div className="flex flex-col items-start gap-3 sm:gap-6">
            <Reveal>
              <span className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-black/10 backdrop-blur-md lg:text-sm">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <Sparkles className="relative size-3.5 shrink-0 text-brand-orange-300" />
                <span className="relative">{t("trustedBadge")}</span>
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="max-w-xl animate-gradient-x bg-[length:200%_auto] bg-gradient-to-r from-white via-brand-orange-200 to-white bg-clip-text text-3xl font-extrabold leading-[1.15] tracking-tight text-transparent drop-shadow-[0_3px_16px_rgba(0,0,0,0.7)] sm:text-5xl sm:leading-[1.1] lg:text-6xl">
                {t.rich("heroTitle", {
                  trusted: (chunks) => <span className="text-green-400">{chunks}</span>,
                  local: (chunks) => <span className="text-yellow-300">{chunks}</span>,
                })}
              </h1>
            </Reveal>
            <Reveal delay={0.16} className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
              {TRUST_ITEMS.map(({ icon: Icon, prefixKey, prefix, captionKey }) => (
                <span
                  key={prefixKey ?? prefix}
                  className="inline-flex w-full items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 shadow-sm backdrop-blur-sm sm:w-auto sm:gap-1.5 sm:rounded-full sm:py-1.5 sm:pl-1.5 sm:pr-3"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 text-white shadow-sm sm:size-6">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight sm:flex-row sm:items-center sm:gap-1">
                    <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] sm:whitespace-nowrap sm:text-sm sm:font-semibold">
                      {prefixKey ? t(prefixKey) : prefix}
                    </span>
                    {captionKey && (
                      <span className="text-[10px] font-medium leading-tight text-white/80 sm:text-xs sm:font-normal sm:text-white/75">
                        {t(captionKey)}
                      </span>
                    )}
                  </span>
                </span>
              ))}
            </Reveal>
            <Reveal delay={0.24} className="flex flex-col items-start gap-2">
              <Link href="/book" className="group/cta">
                <Button
                  variant="secondary"
                  size="lg"
                  className="!rounded-xl !bg-none !bg-[rgb(244,166,35)] !py-2.5 lg:px-8 lg:!py-4 lg:text-lg"
                >
                  <Phone className="size-4 transition-transform duration-300 group-hover/cta:-rotate-12" />
                  {t("cta")}
                </Button>
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 sm:text-xs">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-400" />
                {t("heroSlogan")}
              </span>
            </Reveal>
          </div>
          <HeroVisual />
        </Card>
        </div>
      </section>

      <Reveal delay={0.1}>
        <CouponBanner
          code="FIRST10"
          label={t("couponText")}
        />
      </Reveal>

      {categories === null ? (
        <SectionError
          title={t("categoriesUnavailableTitle")}
          message={t("categoriesUnavailable")}
          retryLabel={tc("tryAgain")}
        />
      ) : (
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        <Reveal className="flex items-end justify-between">
          <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">{t("categoriesHeading")}</h2>
          <Link
            href="/services"
            className="group inline-flex items-center gap-1 text-sm font-medium text-brand-navy-700 dark:text-brand-orange-400"
          >
            {tc("viewAll")}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <div className="scroll-x-thin -mx-3 min-w-0 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
          <div className="flex w-max snap-x snap-mandatory gap-4 sm:gap-6">
            {categories.map((category, i) => {
              const image = getCategoryImage(category.slug);
              const accent = CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length];
              return (
                <Reveal key={category._id} delay={Math.min(i * 0.06, 0.3)} className="shrink-0 snap-start">
                  <Link href={`/services/${category.slug}`} className="group flex w-20 flex-col items-center gap-2 sm:w-24">
                    <div
                      className={cn(
                        "relative rounded-full bg-gradient-to-br p-[3px] shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl",
                        accent.icon,
                      )}
                    >
                      <div className="relative size-[72px] overflow-hidden rounded-full bg-surface ring-4 ring-background sm:size-24">
                        {image ? (
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <span
                            className={cn(
                              "flex size-full items-center justify-center bg-gradient-to-br text-white",
                              accent.icon,
                            )}
                          >
                            <CategoryIcon slug={category.slug} className="size-7 sm:size-9" />
                          </span>
                        )}
                      </div>
                      {category.isNew && (
                        <span className="absolute -right-0.5 -top-0.5 flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 text-white shadow-sm ring-2 ring-background">
                          <Sparkles className="size-3" />
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="max-w-[5.5rem] truncate text-xs font-semibold text-foreground sm:max-w-[6rem] sm:text-sm">
                        {category.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                        {t("fromPrice", { price: category.startingPrice })}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {karigars === null ? (
        <SectionError
          title={t("karigarsUnavailableTitle")}
          message={t("karigarsUnavailable")}
          retryLabel={tc("tryAgain")}
        />
      ) : featuredKarigars.length > 0 && (
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          <Reveal className="flex items-end justify-between">
            <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">{t("karigarsHeading")}</h2>
            <Link
              href="/karigars"
              className="group inline-flex items-center gap-1 text-sm font-medium text-brand-navy-700 dark:text-brand-orange-400"
            >
              {tc("viewAll")}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <div className="scroll-x-thin -mx-3 min-w-0 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
            <div className="flex w-max snap-x snap-mandatory gap-3 sm:grid sm:w-auto sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {featuredKarigars.map((karigar, i) => (
                <Reveal
                  key={karigar._id}
                  delay={Math.min(i * 0.06, 0.3)}
                  className="w-40 shrink-0 snap-start sm:w-auto sm:shrink"
                >
                  <KarigarCard karigar={karigar} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      <CustomerFeedback reviews={feedback} />

      <HomeSafety />
    </div>
  );
}
