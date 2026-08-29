"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HardHat, IndianRupee, Timer, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import {
  fetchAdminContracts,
  sendContractQuote,
  updateContractStatus,
  type AdminContract,
} from "@/lib/api/contracts";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  quote_requested: "warning",
  quoted: "info",
  agreed: "brand",
  in_progress: "brand",
  completed: "neutral",
  cancelled: "danger",
};

const NEXT_STATUS: Record<string, string[]> = {
  agreed: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
};

function QuoteControl({ contract }: { contract: AdminContract }) {
  const queryClient = useQueryClient();
  const [estimatedCost, setEstimatedCost] = useState("");
  const [timeline, setTimeline] = useState("");

  async function handleSend() {
    if (!estimatedCost || !timeline) return;
    await sendContractQuote(contract._id, { estimatedCost: Number(estimatedCost), timeline });
    await queryClient.invalidateQueries({ queryKey: ["admin-contracts"] });
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="Cost (₹)"
        value={estimatedCost}
        onChange={(e) => setEstimatedCost(e.target.value)}
        className="w-24 py-1.5 text-xs"
      />
      <Input
        placeholder="Timeline"
        value={timeline}
        onChange={(e) => setTimeline(e.target.value)}
        className="w-28 py-1.5 text-xs"
      />
      <Button
        variant="primary"
        size="sm"
        disabled={!estimatedCost || !timeline}
        onClick={handleSend}
      >
        Send quote
      </Button>
    </div>
  );
}

function StatusControl({ contract }: { contract: AdminContract }) {
  const queryClient = useQueryClient();
  const options = NEXT_STATUS[contract.status];
  if (!options) return null;

  async function handleChange(status: string) {
    await updateContractStatus(contract._id, status);
    await queryClient.invalidateQueries({ queryKey: ["admin-contracts"] });
  }

  return (
    <Select
      aria-label="Update contract status"
      defaultValue=""
      onChange={(e) => e.target.value && handleChange(e.target.value)}
      className="py-1.5 text-xs"
    >
      <option value="">Move to…</option>
      {options.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </Select>
  );
}

function EstimateSummary({ contract }: { contract: AdminContract }) {
  if (contract.estimatedCost === undefined) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-slate-500">
      <span className="flex items-center gap-0.5">
        <IndianRupee className="size-3 shrink-0" />
        {contract.estimatedCost}
      </span>
      <span className="text-slate-300 dark:text-slate-600">·</span>
      <span className="flex items-center gap-0.5">
        <Timer className="size-3 shrink-0" />
        {contract.timeline}
      </span>
    </p>
  );
}

function ContractRow({ contract }: { contract: AdminContract }) {
  return (
    <tr className="border-b border-black/5 align-top last:border-0 dark:border-white/5">
      <td className="px-4 py-3 font-medium text-foreground">{contract.contractorId.name}</td>
      <td className="px-4 py-3 text-slate-500">{contract.customerId.name ?? contract.customerId.phone}</td>
      <td className="max-w-xs truncate px-4 py-3 text-slate-500">{contract.scopeDescription}</td>
      <td className="px-4 py-3">
        <Badge variant={STATUS_VARIANT[contract.status]}>{contract.status}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2">
          {contract.status === "quote_requested" && <QuoteControl contract={contract} />}
          <EstimateSummary contract={contract} />
          <StatusControl contract={contract} />
        </div>
      </td>
    </tr>
  );
}

function ContractCard({ contract }: { contract: AdminContract }) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <HardHat className="size-3.5 shrink-0" />
          {contract.contractorId.name}
        </span>
        <Badge variant={STATUS_VARIANT[contract.status]}>{contract.status}</Badge>
      </div>
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <User className="size-3.5 shrink-0" />
        {contract.customerId.name ?? contract.customerId.phone}
      </p>
      <p className="text-sm text-slate-500">{contract.scopeDescription}</p>
      {contract.status === "quote_requested" && <QuoteControl contract={contract} />}
      <EstimateSummary contract={contract} />
      <StatusControl contract={contract} />
    </Card>
  );
}

export default function AdminContractsPage() {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["admin-contracts"],
    queryFn: () => fetchAdminContracts(),
  });

  return (
    <div>
      <PageHeader
        title="Contracts"
        subtitle="Send a cost/timeline estimate for new quote requests; move agreed contracts through in-progress to completed."
      />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !contracts?.length ? (
        <p className="mt-4 text-sm text-slate-500">No contracts yet.</p>
      ) : (
        <>
          <Card className="mt-4 hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-4 py-2.5">Contractor</th>
                    <th className="px-4 py-2.5">Customer</th>
                    <th className="px-4 py-2.5">Scope</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <ContractRow key={c._id} contract={c} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {contracts.map((c) => (
              <ContractCard key={c._id} contract={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
