import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, BadgeCheck, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { apiFetch, ApiError } from "@/lib/api-client";
import { SITE_URL } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QuoteRequestForm } from "@/components/features/contracts/quote-request-form";
import { SectionError } from "@/components/ui/section-error";
import { isFullyVerified, type Karigar } from "@/types";
import type { KarigarReviewItem } from "@/lib/api/reviews";

export const dynamic = "force-dynamic";

async function getKarigar(id: string): Promise<Karigar | null> {
  try {
    return await apiFetch<Karigar>(`/karigars/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/karigars/[id]">): Promise<Metadata> {
  const { id } = await params;
  const karigar = await getKarigar(id);
  if (!karigar) return { title: "Karigar Saathi" };
  return {
    title: `${karigar.name} — ${karigar.primarySkill} — Karigar Saathi`,
    description: `${karigar.name}, a verified ${karigar.primarySkill} serving ${karigar.areasServed.join(", ")}. Rated ${karigar.rating.toFixed(1)}/5 from ${karigar.reviewCount} reviews.`,
  };
}

export default async function KarigarDetailPage({
  params,
}: PageProps<"/[locale]/karigars/[id]">) {
  const { id } = await params;
  const t = await getTranslations("common");
  const tHome = await getTranslations("home");
  const tKarigarDetail = await getTranslations("karigarDetailPage");
  const karigar = await getKarigar(id);

  if (!karigar) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <SectionError
          title={tKarigarDetail("unavailableTitle")}
          message={tKarigarDetail("unavailable")}
          retryLabel={t("tryAgain")}
        />
      </div>
    );
  }

  const reviews = await apiFetch<KarigarReviewItem[]>(`/karigars/${id}/reviews`).catch(() => []);
  const verified = isFullyVerified(karigar.verificationChecklist);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: karigar.name,
    url: `${SITE_URL}/karigars/${karigar._id}`,
    areaServed: karigar.areasServed,
    ...(karigar.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: karigar.rating,
        reviewCount: karigar.reviewCount,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col items-start gap-4 rounded-3xl border border-black/10 bg-surface p-6 dark:border-white/10 sm:flex-row sm:items-center lg:p-8">
        <Avatar
          name={karigar.name}
          src={karigar.photoUrl ?? "/ac-worker.png"}
          className="size-16 shrink-0 text-lg lg:size-20 lg:text-xl"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">{karigar.name}</h1>
            {verified && (
              <Badge variant="success">
                <BadgeCheck className="size-3.5" />
                {tHome("pointVerified")}
              </Badge>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            {karigar.primarySkill} ·
            <span className="inline-flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {karigar.rating.toFixed(1)} ({karigar.reviewCount} reviews)
            </span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="size-3.5" />
            {karigar.areasServed.join(", ")}
          </p>
        </div>
      </div>

      {karigar.type === "contractor" ? (
        <div className="mt-6">
          <QuoteRequestForm contractorId={karigar._id} />
        </div>
      ) : (
        <Link href="/book">
          <Button variant="primary" size="lg" className="mt-6 w-full sm:w-auto">
            {t("bookThisKarigar")}
          </Button>
        </Link>
      )}

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {tKarigarDetail("reviewsHeading")}
      </h2>
      {!reviews.length ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t("noReviewsYet")}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl border border-black/10 bg-surface p-4 text-sm dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{review.customerId?.name ?? t("customer")}</span>
                <span className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5"
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </span>
              </div>
              {review.comment && <p className="mt-1.5 text-slate-600 dark:text-slate-400">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
