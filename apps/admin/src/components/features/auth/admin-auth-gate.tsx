"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAdmin } from "@/hooks/use-current-admin";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useCurrentAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace("/login");
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-brand-navy-200 border-t-brand-navy-600 dark:border-white/15 dark:border-t-brand-orange-400" />
      </div>
    );
  }

  if (isError || !data) return null;

  return <>{children}</>;
}
