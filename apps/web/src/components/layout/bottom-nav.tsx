"use client";

import { Home, CalendarDays, Wrench, HardHat, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

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
      <div className="mx-auto flex max-w-5xl items-center justify-around py-1.5">
        {NAV_ITEMS.map(({ href, key, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-xs transition-colors sm:px-3 ${
                active ? "text-brand-navy-700 dark:text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {active && (
                <span className="absolute -top-1.5 h-0.5 w-6 rounded-full bg-gradient-to-r from-brand-navy-600 to-brand-orange-500" />
              )}
              <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
              <span className={active ? "font-medium" : ""}>{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
