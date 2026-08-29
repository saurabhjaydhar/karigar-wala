"use client";

import Image from "next/image";
import {
  Home,
  Wrench,
  HardHat,
  Lightbulb,
  Handshake,
  Info,
  ShieldCheck,
  HelpCircle,
  Mail,
  CalendarPlus,
  CalendarDays,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

const PRIMARY_LINKS: NavLink[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/services", labelKey: "services", icon: Wrench },
  { href: "/karigars", labelKey: "karigars", icon: HardHat },
  { href: "/how-it-works", labelKey: "howItWorks", icon: Lightbulb },
  { href: "/partner-with-us", labelKey: "partnerWithUs", icon: Handshake },
];

const ACCOUNT_LINKS: NavLink[] = [
  { href: "/my-bookings", labelKey: "myBookings", icon: CalendarDays },
  { href: "/profile", labelKey: "profile", icon: User },
];

const SECONDARY_LINKS: NavLink[] = [
  { href: "/about-us", labelKey: "aboutUs", icon: Info },
  { href: "/safety", labelKey: "safety", icon: ShieldCheck },
  { href: "/faq", labelKey: "faq", icon: HelpCircle },
  { href: "/contact", labelKey: "contactUs", icon: Mail },
];

export function SiteSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/10 bg-white/70 shadow-sm shadow-black/[0.02] backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/60 lg:flex 2xl:w-80">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/icon-192.png" alt="" width={36} height={36} className="rounded-xl shadow-sm" />
        <span className="text-xl font-bold tracking-tight text-brand-navy-700 dark:text-white">
          Karigar Saathi
        </span>
      </Link>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 pb-3">
        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("menuSection")}
        </p>
        <nav className="flex flex-col gap-1">
          {PRIMARY_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-medium transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-brand-navy-600 to-brand-navy-700 text-white shadow-md shadow-brand-navy-900/20"
                    : "text-foreground/75 hover:translate-x-0.5 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
                )}
              >
                <link.icon
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-110",
                  )}
                />
                {t(link.labelKey)}
                {active && <span className="ml-auto size-1.5 rounded-full bg-white/80" />}
              </Link>
            );
          })}
        </nav>

        <Link href="/book" className="mt-4">
          <Button className="w-full gap-2 text-base shadow-md shadow-brand-orange-600/20">
            <CalendarPlus className="size-4.5" />
            {tc("bookACarigar")}
          </Button>
        </Link>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("accountSection")}
        </p>
        <nav className="flex flex-col gap-1">
          {ACCOUNT_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2 text-[0.95rem] transition-all duration-200",
                  active
                    ? "bg-brand-navy-50 text-brand-navy-700 dark:bg-white/10 dark:text-white"
                    : "text-foreground/60 hover:translate-x-0.5 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
                )}
              >
                <link.icon
                  className={cn(
                    "size-4.5 shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-110",
                  )}
                />
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("moreSection")}
        </p>
        <nav className="flex flex-col gap-1">
          {SECONDARY_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2 text-[0.95rem] transition-all duration-200",
                  active
                    ? "bg-brand-navy-50 text-brand-navy-700 dark:bg-white/10 dark:text-white"
                    : "text-foreground/60 hover:translate-x-0.5 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
                )}
              >
                <link.icon
                  className={cn(
                    "size-4.5 shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-110",
                  )}
                />
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-black/10 px-4 py-3.5 dark:border-white/10">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </aside>
  );
}
