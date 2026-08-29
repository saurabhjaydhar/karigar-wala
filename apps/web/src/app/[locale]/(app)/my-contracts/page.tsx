"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IndianRupee, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { RequireAuth } from "@/components/features/auth/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { useMyContracts } from "@/hooks/use-my-contracts";
import { acceptContract, cancelContract } from "@/lib/api/contracts";
import type { ContractItem } from "@/lib/api/contracts";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  quote_requested: "warning",
  quoted: "info",
  agreed: "brand",
  in_progress: "brand",
  completed: "success",
  cancelled: "danger",
};

const CANCELLABLE_STATUSES = new Set(["quote_requested", "quoted", "agreed", "in_progress"]);

function ContractCard({ contract }: { contract: ContractItem }) {
  const t = useTranslations("contractsPage");
  const tc = useTranslations("common");
  const STATUS_LABEL: Record<string, string> = {
    quote_requested: t("statusQuoteRequested"),
    quoted: t("statusQuoted"),
    agreed: t("statusAgreed"),
    in_progress: t("statusInProgress"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
  };
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function handleAccept() {
    setBusy(true);
    try {
      await acceptContract(contract._id);
      await queryClient.invalidateQueries({ queryKey: ["contracts", "me"] });
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    setBusy(true);
    try {
      await cancelContract(contract._id);
      await queryClient.invalidateQueries({ queryKey: ["contracts", "me"] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{contract.contractorId.name}</span>
        <Badge variant={STATUS_VARIANT[contract.status] ?? "neutral"}>
          {STATUS_LABEL[contract.status] ?? contract.status}
        </Badge>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{contract.scopeDescription}</p>
      {contract.estimatedCost !== undefined && (
        <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <IndianRupee className="size-3.5 shrink-0" />
          {contract.estimatedCost}
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <Timer className="size-3.5 shrink-0" />
          {contract.timeline}
        </p>
      )}
      <div className="mt-1 flex gap-2">
        {contract.status === "quoted" && (
          <Button type="button" variant="primary" size="sm" loading={busy} onClick={handleAccept}>
            {t("acceptQuote")}
          </Button>
        )}
        {CANCELLABLE_STATUSES.has(contract.status) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-500/10"
            loading={busy}
            onClick={handleCancel}
          >
            {tc("cancel")}
          </Button>
        )}
      </div>
    </Card>
  );
}

function ContractsList() {
  const t = useTranslations("contractsPage");
  const { data: contracts, isLoading } = useMyContracts();

  if (isLoading) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!contracts?.length) {
    return (
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {contracts.map((contract, i) => (
        <Reveal key={contract._id} delay={Math.min(i * 0.05, 0.3)}>
          <ContractCard contract={contract} />
        </Reveal>
      ))}
    </div>
  );
}

export default function MyContractsPage() {
  const t = useTranslations("contractsPage");
  return (
    <RequireAuth>
      {() => (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
          <ContractsList />
        </div>
      )}
    </RequireAuth>
  );
}
