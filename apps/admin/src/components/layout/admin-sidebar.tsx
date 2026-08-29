"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useCurrentAdmin } from "@/hooks/use-current-admin";
import { adminLogout } from "@/lib/api/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAV_ITEMS } from "./nav-items";

export function AdminSidebar() {
  const { data } = useCurrentAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleLogout() {
    await adminLogout();
    await queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/10 bg-surface p-4 dark:border-white/10 md:flex">
      <div className="flex items-center gap-2 px-1">
        <Image src="/icon.png" alt="" width={30} height={30} className="rounded-lg" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-brand-navy-700 dark:text-white">
            Karigar Saathi
          </p>
          {data?.admin && <p className="truncate text-xs text-slate-500">{data.admin.email}</p>}
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-gradient-to-r from-brand-navy-600 to-brand-navy-700 font-medium text-white shadow-sm"
                  : "text-foreground/75 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut className="size-4" />
          Log out
        </button>
        <ThemeToggle />
      </div>
    </aside>
  );
}
