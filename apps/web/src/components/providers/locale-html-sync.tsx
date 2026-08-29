"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

// The <html lang> attribute lives in the root layout (above the [locale]
// segment) so it isn't reset on every locale switch. This keeps it in sync
// client-side when the locale changes without a full document reload.
export function LocaleHtmlSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
