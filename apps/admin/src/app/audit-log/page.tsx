"use client";

import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { fetchAuditLog, type AuditLogEntry } from "@/lib/api/audit-log";

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  return (
    <tr className="border-b border-black/5 align-top last:border-0 dark:border-white/5">
      <td className="px-4 py-3 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</td>
      <td className="px-4 py-3 font-medium text-foreground">{entry.adminId?.name ?? "—"}</td>
      <td className="px-4 py-3 font-mono text-xs">{entry.action}</td>
      <td className="px-4 py-3 text-xs text-slate-500">
        {entry.targetType} · {entry.targetId}
      </td>
    </tr>
  );
}

function AuditLogCard({ entry }: { entry: AuditLogEntry }) {
  return (
    <Card className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-foreground">{entry.adminId?.name ?? "—"}</span>
        <span className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</span>
      </div>
      <p className="font-mono text-xs">{entry.action}</p>
      <p className="text-xs text-slate-500">
        {entry.targetType} · {entry.targetId}
      </p>
    </Card>
  );
}

export default function AdminAuditLogPage() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["admin-audit-log"],
    queryFn: fetchAuditLog,
  });

  return (
    <div>
      <div className="flex items-center gap-2">
        <ScrollText className="size-5 shrink-0 text-brand-navy-600" />
        <PageHeader
          title="Audit Log"
          subtitle="Who verified, assigned, quoted, or moderated what — most recent 200 actions."
        />
      </div>
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : !entries?.length ? (
        <p className="mt-4 text-sm text-slate-500">No actions logged yet.</p>
      ) : (
        <>
          <Card className="mt-4 hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-4 py-2.5">When</th>
                    <th className="px-4 py-2.5">Admin</th>
                    <th className="px-4 py-2.5">Action</th>
                    <th className="px-4 py-2.5">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <AuditLogRow key={entry._id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {entries.map((entry) => (
              <AuditLogCard key={entry._id} entry={entry} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
