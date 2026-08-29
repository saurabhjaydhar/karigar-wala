"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useCurrentAdmin } from "@/hooks/use-current-admin";
import { adminLogout } from "@/lib/api/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAV_ITEMS } from "./nav-items";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const { data } = useCurrentAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Close the drawer on route change — adjusted during render (React's
  // recommended pattern for this), not in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    await adminLogout();
    await queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    router.push("/login");
  }

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/80 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex size-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Menu className="size-[18px]" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/icon.png" alt="" width={24} height={24} className="rounded-md" />
          <span className="font-semibold text-brand-navy-700 dark:text-white">Karigar Saathi</span>
        </div>
        <ThemeToggle />
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-brand-navy-950/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col border-r border-white/40 bg-white/90 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-brand-navy-950/90 md:hidden"
            >
              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="font-semibold text-brand-navy-700 dark:text-white">Karigar Saathi</p>
                  {data?.admin && <p className="text-xs text-slate-500">{data.admin.email}</p>}
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-gradient-to-r from-brand-navy-600 to-brand-navy-700 font-medium text-white"
                          : "text-foreground/75 hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 rounded-xl border-t border-black/10 px-2.5 py-2.5 pt-4 text-sm text-red-600 dark:border-white/10"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
