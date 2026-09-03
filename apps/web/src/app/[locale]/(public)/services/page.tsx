import { getTranslations } from "next-intl/server";
import { apiFetch } from "@/lib/api-client";
import { ServiceCard } from "@/components/features/service-card/service-card";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { SectionError } from "@/components/ui/section-error";
import type { ServiceCategory } from "@/types";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const t = await getTranslations("servicesPage");
  const tc = await getTranslations("common");
  const categories = await apiFetch<ServiceCategory[]>("/services").catch(() => null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
      <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      {categories === null ? (
        <div className="mt-6">
          <SectionError
            title={t("categoriesUnavailableTitle")}
            message={t("categoriesUnavailable")}
            retryLabel={tc("tryAgain")}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {categories.map((category, i) => (
            <Reveal key={category._id} delay={Math.min(i * 0.05, 0.3)}>
              <ServiceCard service={category} index={i} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
