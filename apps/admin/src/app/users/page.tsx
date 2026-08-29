"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { fetchUsers, type AdminUser } from "@/lib/api/users";

function UserRow({ user }: { user: AdminUser }) {
  return (
    <tr className="border-b border-black/5 align-top last:border-0 dark:border-white/5">
      <td className="px-4 py-3 font-medium text-foreground">{user.name ?? "—"}</td>
      <td className="px-4 py-3 text-slate-500">{user.phone}</td>
      <td className="px-4 py-3 text-slate-500">{user.email ?? "—"}</td>
      <td className="px-4 py-3 text-slate-500">{new Date(user.memberSince).toLocaleDateString()}</td>
      <td className="px-4 py-3">{user.isTrusted ? <Badge variant="success">Trusted</Badge> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
    </tr>
  );
}

function UserCard({ user }: { user: AdminUser }) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{user.name ?? "—"}</span>
        {user.isTrusted ? <Badge variant="success">Trusted</Badge> : null}
      </div>
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <Phone className="size-3.5 shrink-0" />
        {user.phone}
      </p>
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <Mail className="size-3.5 shrink-0" />
        {user.email ?? "—"}
      </p>
      <p className="text-sm text-slate-500">Member since {new Date(user.memberSince).toLocaleDateString()}</p>
    </Card>
  );
}

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", q],
    queryFn: () => fetchUsers(q || undefined),
  });

  return (
    <div>
      <PageHeader title="Users" subtitle="Search and review customer accounts." />
      <div className="relative mt-4 max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or phone…"
          className="pl-9"
        />
      </div>
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !users?.length ? (
        <p className="mt-4 text-sm text-slate-500">No users found.</p>
      ) : (
        <>
          <Card className="mt-4 hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Phone</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Member since</th>
                    <th className="px-4 py-2.5">Trusted</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <UserRow key={u._id} user={u} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {users.map((u) => (
              <UserCard key={u._id} user={u} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
