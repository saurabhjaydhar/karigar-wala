import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { apiFetch, ApiError } from "@/lib/api-client";
import { SITE_URL } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/lib/category-icons";
import type { ServiceCategory, SubService } from "@/types";

export const dynamic = "force-dynamic";

async function getService(slug: string): Promise<ServiceCategory> {
  try {
    return await apiFetch<ServiceCategory>(`/services/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  return {
    title: `${service.name} — Karigar Saathi`,
    description: service.description ?? `Book a verified ${service.name} near you.`,
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/[locale]/services/[slug]">) {
  const { slug } = await params;
  const t = await getTranslations("common");
  const tService = await getTranslations("serviceDetailPage");
  const service = await getService(slug);
  const subServices = await apiFetch<SubService[]>(`/services/${service._id}/sub-services`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: { "@type": "LocalBusiness", name: "Karigar Saathi" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: service.startingPrice,
      url: `${SITE_URL}/services/${service.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Card className="flex flex-col gap-4 !rounded-3xl bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 !border-0 p-6 text-white sm:p-8 lg:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 lg:size-16">
          <CategoryIcon slug={service.slug} className="size-7 lg:size-8" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">{service.name}</h1>
          <p className="mt-1.5 text-sm text-white/80 sm:text-base lg:text-lg">{service.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold lg:text-xl">{t("from")} ₹{service.startingPrice}</span>
          <Link href="/book">
            <Button variant="secondary">{t("bookNow")}</Button>
          </Link>
        </div>
      </Card>

      {!!subServices.length && (
        <div className="mt-8 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {tService("whatWeOffer")}
          </h2>
          {subServices.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center justify-between rounded-xl border border-black/10 bg-surface px-4 py-3 text-sm transition-colors hover:border-brand-navy-200 dark:border-white/10 dark:hover:border-brand-navy-400/40"
            >
              <div>
                <p className="font-medium">{sub.name}</p>
                {sub.description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub.description}</p>}
              </div>
              <span className="shrink-0 text-sm font-semibold text-brand-navy-700 dark:text-brand-orange-300">
                {t("from")} ₹{sub.basePrice}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
