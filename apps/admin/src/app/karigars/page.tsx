"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, MapPin, Phone, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import {
  fetchAdminKarigars,
  updateKarigarStatus,
  updateKarigarChecklist,
  type AdminKarigar,
  type KarigarVerificationChecklist,
} from "@/lib/api/karigars";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const CHECKLIST_LABELS: Record<keyof KarigarVerificationChecklist, string> = {
  idVerified: "Government ID verified",
  addressVerified: "Address verified",
  backgroundCheckPassed: "Background/reference check passed",
  skillAssessmentPassed: "Skill assessment passed",
};

function ChecklistToggles({ karigar }: { karigar: AdminKarigar }) {
  const queryClient = useQueryClient();

  async function toggle(key: keyof KarigarVerificationChecklist) {
    await updateKarigarChecklist(karigar._id, { [key]: !karigar.verificationChecklist[key] });
    await queryClient.invalidateQueries({ queryKey: ["admin-karigars"] });
  }

  const checked = Object.values(karigar.verificationChecklist).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-1 text-xs text-slate-500">
      <span className="font-medium text-foreground/70">{checked}/4 verified</span>
      {(Object.keys(CHECKLIST_LABELS) as (keyof KarigarVerificationChecklist)[]).map((key) => (
        <label key={key} className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={karigar.verificationChecklist[key]}
            onChange={() => toggle(key)}
            className="size-3.5 accent-brand-navy-600"
          />
          {CHECKLIST_LABELS[key]}
        </label>
      ))}
    </div>
  );
}

function StatusActions({ karigar }: { karigar: AdminKarigar }) {
  const queryClient = useQueryClient();

  async function setStatus(status: "approved" | "rejected") {
    await updateKarigarStatus(karigar._id, status);
    await queryClient.invalidateQueries({ queryKey: ["admin-karigars"] });
  }

  return (
    <div className="flex gap-2">
      {karigar.verificationStatus !== "approved" && (
        <Button variant="primary" size="sm" onClick={() => setStatus("approved")}>
          <CheckCircle2 className="size-3.5" />
          Approve
        </Button>
      )}
      {karigar.verificationStatus !== "rejected" && (
        <Button variant="danger" size="sm" onClick={() => setStatus("rejected")}>
          <XCircle className="size-3.5" />
          Reject
        </Button>
      )}
    </div>
  );
}

function KarigarRow({ karigar }: { karigar: AdminKarigar }) {
  return (
    <tr className="border-b border-black/5 align-top last:border-0 dark:border-white/5">
      <td className="px-4 py-3 font-medium text-foreground">{karigar.name}</td>
      <td className="px-4 py-3 text-slate-500">{karigar.phone}</td>
      <td className="px-4 py-3 text-slate-500">
        {karigar.type} · {karigar.primarySkill}
      </td>
      <td className="px-4 py-3 text-slate-500">{karigar.areasServed.join(", ")}</td>
      <td className="px-4 py-3">
        <Badge variant={STATUS_VARIANT[karigar.verificationStatus]}>{karigar.verificationStatus}</Badge>
      </td>
      <td className="px-4 py-3">
        <ChecklistToggles karigar={karigar} />
      </td>
      <td className="px-4 py-3">
        <StatusActions karigar={karigar} />
      </td>
    </tr>
  );
}

function KarigarCard({ karigar }: { karigar: AdminKarigar }) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{karigar.name}</span>
        <Badge variant={STATUS_VARIANT[karigar.verificationStatus]}>{karigar.verificationStatus}</Badge>
      </div>
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <Phone className="size-3.5 shrink-0" />
        {karigar.phone}
      </p>
      <p className="text-sm text-slate-500">
        {karigar.type} · {karigar.primarySkill}
      </p>
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin className="size-3.5 shrink-0" />
        {karigar.areasServed.join(", ")}
      </p>
      <ChecklistToggles karigar={karigar} />
      <StatusActions karigar={karigar} />
    </Card>
  );
}

export default function AdminKarigarsPage() {
  const { data: karigars, isLoading } = useQuery({
    queryKey: ["admin-karigars"],
    queryFn: () => fetchAdminKarigars(),
  });

  return (
    <div>
      <PageHeader
        title="Karigar Verification Queue"
        subtitle={
          'Approve or reject applications submitted via "Partner with Us". Only approved, active karigars appear in the customer directory.'
        }
      />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <>
          <Card className="mt-4 hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Phone</th>
                    <th className="px-4 py-2.5">Type / Skill</th>
                    <th className="px-4 py-2.5">Areas</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">4-Point Checklist</th>
                    <th className="px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {karigars?.map((k) => (
                    <KarigarRow key={k._id} karigar={k} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {karigars?.map((k) => (
              <KarigarCard key={k._id} karigar={k} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
