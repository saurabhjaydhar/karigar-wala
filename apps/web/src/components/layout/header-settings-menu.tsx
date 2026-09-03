"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useLocaleSwitch } from "@/hooks/use-locale-switch";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function HeaderSettingsMenu() {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, switchLocale, isPending } = useLocaleSwitch();

  // Hydration-safe "has the client mounted yet" flag, same pattern as
  // ThemeToggle — avoids rendering a theme-dependent state before
  // next-themes resolves the real theme.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("toggleTheme")}
        onClick={() => setIsOpen((open) => !open)}
        className="flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
      >
        <Palette className="size-[18px]" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-white/40 bg-white/90 p-3 shadow-xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/90"
            >
              <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {t("toggleTheme")}
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    !isDark
                      ? "bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-sm"
                      : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10",
                  )}
                >
                  <Sun className="size-4" />
                  {t("light")}
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isDark
                      ? "bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-sm"
                      : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10",
                  )}
                >
                  <Moon className="size-4" />
                  {t("dark")}
                </button>
              </div>

              <div className="my-3 h-px bg-black/10 dark:bg-white/10" />

              <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {t("toggleLanguage")}
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => switchLocale("en")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                    locale === "en"
                      ? "bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 text-white shadow-sm"
                      : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10",
                  )}
                >
                  {t("english")}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => switchLocale("hi")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                    locale === "hi"
                      ? "bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 text-white shadow-sm"
                      : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10",
                  )}
                >
                  {t("hindi")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
