"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminAuthGate } from "@/components/features/auth/admin-auth-gate";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <main className="min-h-screen flex-1">{children}</main>;
  }

  return (
    <AdminAuthGate>
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminMobileNav />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </AdminAuthGate>
  );
}
