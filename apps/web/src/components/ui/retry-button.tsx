"use client";

import { useTransition } from "react";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RetryButton({ label }: { label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(() => router.refresh());
  }

  return (
    <Button type="button" variant="outline" size="sm" loading={isPending} onClick={handleRetry}>
      <RotateCw className="size-3.5" />
      {label}
    </Button>
  );
}
