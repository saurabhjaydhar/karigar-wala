import Image from "next/image";
import { Star, BadgeCheck, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isFullyVerified, type Karigar } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function KarigarCard({ karigar }: { karigar: Karigar }) {
  const t = await getTranslations("common");
  const verified = isFullyVerified(karigar.verificationChecklist);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-brand-navy-900/10 dark:border-white/10 dark:hover:shadow-black/30">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={karigar.photoUrl ?? "/ac-worker.png"}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/90 via-brand-navy-950/10 to-transparent" />

        {verified && (
          <Badge
            variant="success"
            className="absolute left-2 top-2 px-1.5 py-1 shadow-sm backdrop-blur-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-0.5"
          >
            <BadgeCheck className="size-3" />
            <span className="hidden sm:inline">{t("verified")}</span>
          </Badge>
        )}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm dark:bg-black/70 dark:text-white sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {karigar.rating.toFixed(1)}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <Link
            href={`/karigars/${karigar._id}`}
            className="block truncate font-semibold text-white drop-shadow-sm hover:underline"
          >
            {karigar.name}
          </Link>
          <p className="truncate text-xs text-white/85">{karigar.skills[0] ?? karigar.primarySkill}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{karigar.areasServed.join(", ")}</span>
        </p>
        <Link href={karigar.type === "contractor" ? `/karigars/${karigar._id}` : "/book"} className="mt-auto block">
          <Button variant="primary" size="sm" className="w-full truncate">
            {karigar.type === "contractor" ? t("requestAQuote") : t("bookNow")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
