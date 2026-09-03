"use client";

import { motion } from "framer-motion";
import { Home, CalendarDays, Wrench, HardHat, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", key: "home", Icon: Home },
  { href: "/my-bookings", key: "myBookings", Icon: CalendarDays },
  { href: "/services", key: "services", Icon: Wrench },
  { href: "/karigars", key: "karigars", Icon: HardHat },
  { href: "/profile", key: "profile", Icon: User },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 border-t border-black/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/85 md:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, key, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="relative">
              <motion.span
                whileTap={{ scale: 0.88 }}
                className="relative flex flex-col items-center gap-0.5 whitespace-nowrap px-1.5 py-1.5 text-xs sm:px-3"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 dark:from-white/10 dark:to-white/[0.04]"
                  />
                )}
                <Icon
                  className={cn(
                    "size-5 transition-colors",
                    active ? "text-brand-navy-700 dark:text-white" : "text-slate-500 dark:text-slate-400",
                  )}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span
                  className={cn(
                    "transition-colors",
                    active ? "font-medium text-brand-navy-700 dark:text-white" : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {t(key)}
                </span>
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
