"use client";

import { useEffect, type ReactNode } from "react";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthPromptStore } from "@/store/use-auth-prompt-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CurrentUser } from "@/lib/api/auth";

interface RequireAuthProps {
  children: (user: CurrentUser) => ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const t = useTranslations("auth");
  const { data: user, isLoading, isError } = useCurrentUser();
  const isModalOpen = useAuthPromptStore((s) => s.isOpen);
  const open = useAuthPromptStore((s) => s.open);

  useEffect(() => {
    if (!isLoading && isError && !isModalOpen) {
      open();
    }
  }, [isLoading, isError, isModalOpen, open]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-8">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300">
          <LogIn className="size-5" />
        </span>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("signInToView")}</p>
        <Button type="button" size="sm" onClick={() => open()}>
          {t("signIn")}
        </Button>
      </div>
    );
  }

  return <>{children(user)}</>;
}
