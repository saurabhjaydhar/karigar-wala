import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ServiceCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/lib/category-icons";
import { getCategoryImage } from "@/lib/category-images";
import { cn } from "@/lib/utils";

const ACCENTS = [
  {
    icon: "from-brand-navy-600 to-brand-navy-800",
    ring: "shadow-brand-navy-900/25",
    bar: "from-brand-navy-500 to-brand-navy-700",
    tint: "from-brand-navy-50/70 dark:from-white/[0.04]",
    watermark: "text-brand-navy-900/[0.04] dark:text-white/[0.05]",
  },
  {
    icon: "from-brand-orange-500 to-brand-orange-600",
    ring: "shadow-brand-orange-600/25",
    bar: "from-brand-orange-400 to-brand-orange-600",
    tint: "from-brand-orange-50/70 dark:from-white/[0.04]",
    watermark: "text-brand-orange-900/[0.05] dark:text-white/[0.05]",
  },
] as const;

export async function ServiceCard({ service, index = 0 }: { service: ServiceCategory; index?: number }) {
  const t = await getTranslations("common");
  const image = getCategoryImage(service.slug);
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-brand-navy-900/10 dark:border-white/10 dark:hover:shadow-black/30">
      <div className="relative aspect-[16/10] overflow-hidden">
        {image ? (
          <>
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/70 via-brand-navy-950/5 to-transparent" />
            <span
              aria-hidden
              className={cn("pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent.bar)}
            />
            <span className="absolute bottom-2 left-2 flex size-7 items-center justify-center rounded-lg bg-white/20 text-white shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 sm:bottom-3 sm:left-3 sm:size-9 sm:rounded-xl">
              <CategoryIcon slug={service.slug} className="size-3.5 sm:size-4" />
            </span>
          </>
        ) : (
          <div className={cn("relative flex size-full items-center justify-center bg-gradient-to-br to-surface", accent.tint)}>
            <span
              aria-hidden
              className={cn("pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent.bar)}
            />
            <CategoryIcon
              slug={service.slug}
              aria-hidden
              className={cn(
                "pointer-events-none absolute -bottom-4 -right-4 size-20 rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 sm:size-24",
                accent.watermark,
              )}
            />
            <span
              className={cn(
                "relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 sm:size-12 sm:rounded-2xl",
                accent.icon,
                accent.ring,
              )}
            >
              <CategoryIcon slug={service.slug} className="size-4 sm:size-6" />
            </span>
          </div>
        )}
        {service.isNew && (
          <Badge variant="brand" className="absolute right-2 top-2 shadow-sm sm:right-3 sm:top-3">
            {t("new")}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div>
          <Link href={`/services/${service.slug}`} className="text-sm font-semibold hover:underline sm:text-base">
            {service.name}
          </Link>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            {service.description}
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t border-black/5 pt-2.5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:pt-3">
          <span className="text-xs font-medium text-foreground sm:text-sm">
            {t("from")}{" "}
            <span className="font-semibold text-brand-navy-700 dark:text-brand-orange-300">
              ₹{service.startingPrice}
            </span>
          </span>
          <Link href="/book" className="sm:shrink-0">
            <Button variant="primary" size="sm" className="w-full sm:w-auto">
              {t("bookNow")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
