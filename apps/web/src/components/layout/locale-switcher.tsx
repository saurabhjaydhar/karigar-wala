"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "en" ? "hi" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: next, scroll: false });
    });
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
