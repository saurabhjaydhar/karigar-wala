"use client";

import { motion } from "framer-motion";
import { HardHat, ShieldCheck, Star, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

const FLOAT_CARDS = [
  {
    id: "karigars",
    icon: ShieldCheck,
    titleKey: "karigarsCount",
    subtitleKey: "karigarsCaption",
    className: "left-0 top-4 w-52 -rotate-3",
    float: [0, -12, 0],
    duration: 6,
  },
  {
    id: "rating",
    icon: Star,
    titleKey: "ratingTitle",
    subtitleKey: "ratingCaption",
    className: "right-0 top-28 w-48 rotate-2",
    float: [0, 10, 0],
    duration: 7,
  },
  {
    id: "sameDay",
    icon: Zap,
    titleKey: "sameDay",
    subtitleKey: "sameDayCaption",
    className: "left-10 top-64 w-56 -rotate-2",
    float: [0, -8, 0],
    duration: 5.5,
  },
] as const;

export function HeroVisual() {
  const t = useTranslations("heroVisual");
  return (
    <div className="relative hidden h-[26rem] w-full lg:block" aria-hidden>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute right-8 top-8 flex size-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 via-brand-navy-700 to-brand-orange-600 opacity-90 shadow-2xl shadow-brand-navy-900/30"
      >
        <span className="flex size-32 items-center justify-center rounded-full border border-white/20">
          <HardHat className="size-14 text-white/90" />
        </span>
      </motion.div>

      {FLOAT_CARDS.map(({ id, icon: Icon, titleKey, subtitleKey, className, float, duration }) => (
        <motion.div
          key={id}
          animate={{ y: [...float] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute flex items-center gap-3 rounded-2xl border border-white/50 bg-white/80 p-3.5 shadow-lg shadow-brand-navy-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/70 ${className}`}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 to-brand-orange-600 text-white">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{t(titleKey)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t(subtitleKey)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
