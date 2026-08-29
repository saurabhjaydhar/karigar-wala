import { getTranslations } from "next-intl/server";
import { ShieldCheck, IdCard, ClipboardCheck, ScrollText, Star, PhoneCall, Wallet, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const ACCENTS = [
  {
    icon: "from-brand-navy-600 to-brand-navy-800",
    ring: "shadow-brand-navy-900/30",
    bar: "from-brand-navy-500 to-brand-navy-700",
    tint: "from-brand-navy-50/70 dark:from-white/[0.04]",
    watermark: "text-brand-navy-900/[0.04] dark:text-white/[0.05]",
  },
  {
    icon: "from-brand-orange-500 to-brand-orange-600",
    ring: "shadow-brand-orange-600/30",
    bar: "from-brand-orange-400 to-brand-orange-600",
    tint: "from-brand-orange-50/70 dark:from-white/[0.04]",
    watermark: "text-brand-orange-900/[0.05] dark:text-white/[0.05]",
  },
] as const;

const POINTS = [
  { key: "aadhaar", icon: IdCard },
  { key: "backgroundCheck", icon: ClipboardCheck },
  { key: "codeOfConduct", icon: ScrollText },
  { key: "ratings", icon: Star },
  { key: "sos", icon: PhoneCall },
  { key: "noAdvancePayment", icon: Wallet },
] as const;

export async function HomeSafety() {
  const t = await getTranslations("homeSafety");

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <Reveal className="flex flex-col items-center gap-2 text-center sm:gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-lg shadow-brand-navy-900/20">
          <ShieldCheck className="size-6" />
        </span>
        <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">{t("heading")}</h2>
        <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">{t("subtitle")}</p>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {POINTS.map((point, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <Reveal key={point.key} delay={Math.min(i * 0.06, 0.3)}>
              <div
                className={cn(
                  "group relative flex h-full flex-col items-center gap-2 overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br to-surface p-4 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl hover:shadow-brand-navy-900/10 dark:border-white/10 dark:hover:shadow-black/30 sm:items-start sm:gap-3 sm:p-5 sm:text-left",
                  accent.tint,
                )}
              >
                <point.icon
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -bottom-3 -right-3 size-20 rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
                    accent.watermark,
                  )}
                />
                <span
                  aria-hidden
                  className={cn("pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent.bar)}
                />

                <span className="relative shrink-0">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 sm:size-12",
                      accent.icon,
                      accent.ring,
                    )}
                  >
                    <point.icon className="size-5" />
                  </span>
                  <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-white text-emerald-600 shadow ring-2 ring-white dark:bg-brand-navy-950 dark:text-emerald-400 dark:ring-brand-navy-950">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                </span>

                <div className="relative">
                  <p className="text-sm font-semibold text-foreground sm:text-base">{t(`${point.key}Title`)}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    {t(`${point.key}Body`)}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
