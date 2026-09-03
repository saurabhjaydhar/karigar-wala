"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, Search, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NotificationsBell } from "@/components/features/notifications/notifications-bell";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services", labelKey: "services" },
  { href: "/karigars", labelKey: "karigars" },
  { href: "/how-it-works", labelKey: "howItWorks" },
  { href: "/partner-with-us", labelKey: "partnerWithUs" },
] as const;

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label={t("openMenu")}
              onClick={() => setDrawerOpen(true)}
              className="flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10 md:hidden"
            >
              <Menu className="size-[18px]" />
            </button>
            <Link href="/" className="flex items-center gap-2 pl-1">
              <Image src="/icon-192.png" alt="" width={32} height={32} className="rounded-lg" />
              <span className="hidden text-lg font-bold tracking-tight text-brand-navy-700 dark:text-white sm:inline">
                Karigar Saathi
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex lg:hidden">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-navy-50 text-brand-navy-700 dark:bg-white/10 dark:text-white"
                      : "text-foreground/70 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
                  )}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden items-center gap-1 md:flex lg:hidden">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <button
              type="button"
              aria-label={t("search")}
              className="flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
            >
              <Search className="size-[18px]" />
            </button>
            <NotificationsBell />
            <Link href="/book" className="hidden md:block lg:hidden">
              <Button size="sm" className="ml-1">
                <Phone className="size-3.5" />
                {tc("bookACarigar")}
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
