"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function CouponBanner({ code, label }: { code: string; label: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard permission denied — silently ignore, code is still visible on the banner
    }
  }

  return (
    <div className="group relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-brand-orange-500/30 via-brand-navy-500/20 to-brand-orange-500/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-brand-navy-950/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-brand-orange-600/20">
        <Image
          src={locale === "hi" ? "/coupon_banner_hindi.png" : "/coupon_banner.png"}
          alt={label}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-overlay" />
          <motion.span
            animate={{ y: [0, -6, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[6%] top-[10%] text-brand-orange-200/80"
          >
            <Sparkles className="size-4 sm:size-5" />
          </motion.span>
          <motion.span
            animate={{ y: [0, 6, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-[13%] top-[22%] text-white/60"
          >
            <Sparkles className="size-3 sm:size-4" />
          </motion.span>
        </div>

        <motion.span
          aria-hidden
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[5%] top-[71%] h-[17%] w-[22%] rounded-xl ring-2 ring-brand-orange-300/70"
        />
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`${t("couponCode")}: ${code}`}
          className="absolute left-[5%] top-[71%] h-[17%] w-[22%] rounded-xl"
        >
          {copied && (
            <span className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/95 text-xs font-semibold text-white shadow-lg sm:text-sm">
              <Check className="size-4" />
              {t("copied")}
            </span>
          )}
        </button>

        <Link
          href="/book"
          aria-label={t("bookACarigar")}
          className="absolute left-[27%] top-[71%] h-[17%] w-[17%] rounded-xl"
        />
      </div>
    </div>
  );
}
