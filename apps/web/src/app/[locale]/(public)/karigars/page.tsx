import { getTranslations } from "next-intl/server";
import { apiFetch } from "@/lib/api-client";
import { KarigarCard } from "@/components/features/karigar-card/karigar-card";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import type { Karigar } from "@/types";

export const dynamic = "force-dynamic";

export default async function KarigarsPage() {
  const t = await getTranslations("karigarsPage");
  const karigars = await apiFetch<Karigar[]>("/karigars");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
      <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {karigars.map((karigar, i) => (
          <Reveal key={karigar._id} delay={Math.min(i * 0.05, 0.3)}>
            <KarigarCard karigar={karigar} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
