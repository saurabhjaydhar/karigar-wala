"use client";

import { useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Locale lives in the URL (`[locale]` segment), so switching it is a real
// Next.js route change that remounts everything below the root layout —
// including server-fetched page data. Two things make that feel instant
// instead of a slow, jarring flash: prefetching the other-locale route
// ahead of time (removes the network wait) and wrapping the actual swap in
// the View Transitions API where supported (crossfades instead of a hard
// cut — falls back to a plain instant swap in browsers without it).
export function useLocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    for (const l of routing.locales) {
      if (l !== locale) router.prefetch(pathname, { locale: l });
    }
  }, [locale, pathname, router]);

  function switchLocale(next: string) {
    if (next === locale) return;
    const apply = () =>
      startTransition(() => {
        router.replace(pathname, { locale: next, scroll: false });
      });

    const canAnimate =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      typeof document.startViewTransition === "function";

    if (canAnimate) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return { locale, switchLocale, isPending };
}
