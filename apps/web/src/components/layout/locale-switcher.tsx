"use client";

import { useTranslations } from "next-intl";
import { useLocaleSwitch } from "@/hooks/use-locale-switch";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const { locale, switchLocale, isPending } = useLocaleSwitch();
  const t = useTranslations("nav");

  function toggle() {
    switchLocale(locale === "en" ? "hi" : "en");
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={t("toggleLanguage")}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-xs font-semibold text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
        isPending && "opacity-50",
      )}
    >
      {locale === "en" ? "हिं" : "EN"}
    </button>
  );
}
