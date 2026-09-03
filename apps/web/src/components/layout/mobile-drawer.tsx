"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface NavLink {
  href: string;
  labelKey: string;
  namespace: "nav" | "common";
}

const PRIMARY_LINKS: NavLink[] = [
  { href: "/", labelKey: "home", namespace: "nav" },
  { href: "/services", labelKey: "services", namespace: "nav" },
  { href: "/karigars", labelKey: "karigars", namespace: "nav" },
  { href: "/book", labelKey: "bookACarigar", namespace: "common" },
  { href: "/partner-with-us", labelKey: "partnerWithUs", namespace: "nav" },
];

const SECONDARY_LINKS: NavLink[] = [
  { href: "/about-us", labelKey: "aboutUs", namespace: "nav" },
  { href: "/how-it-works", labelKey: "howItWorks", namespace: "nav" },
  { href: "/safety", labelKey: "safety", namespace: "nav" },
  { href: "/faq", labelKey: "faq", namespace: "nav" },
  { href: "/contact", labelKey: "contactUs", namespace: "nav" },
  { href: "/terms", labelKey: "termsOfService", namespace: "nav" },
  { href: "/privacy", labelKey: "privacyPolicy", namespace: "nav" },
];

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  // Close the drawer on route change — adjusted during render (React's
  // recommended pattern for this), not in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (open) onClose();
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-brand-navy-950/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col border-r border-white/40 bg-white/85 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-brand-navy-950/85"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-brand-navy-700 dark:text-white">
                Karigar Saathi
              </span>
              <button
                type="button"
                aria-label={t("closeMenu")}
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-1">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-brand-navy-50 dark:hover:bg-white/10"
                >
                  {link.namespace === "common" ? tc(link.labelKey) : t(link.labelKey)}
                </Link>
              ))}
            </nav>

            <div className="my-4 h-px bg-black/10 dark:bg-white/10" />

            <nav className="flex flex-col gap-1">
              {SECONDARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-brand-navy-50 hover:text-foreground dark:hover:bg-white/10"
                >
                  {link.namespace === "common" ? tc(link.labelKey) : t(link.labelKey)}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex items-center justify-center gap-2 border-t border-black/10 pt-4 dark:border-white/10 md:hidden">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
