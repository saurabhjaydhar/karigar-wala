"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  LogOut,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RequireAuth } from "@/components/features/auth/require-auth";
import { PushToggle } from "@/components/features/notifications/push-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";
import { logout, updateProfile, type CurrentUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api-client";

function ProfileHeader({ user }: { user: CurrentUser }) {
  const t = useTranslations("profilePage");
  const tc = useTranslations("common");
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setError(null);
    setEditing(true);
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const updated = await updateProfile({ name: name || undefined, email: email || undefined });
      queryClient.setQueryData(["me"], updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("couldNotUpdate"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card variant="glass" className="relative overflow-hidden !rounded-3xl !p-0">
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-brand-navy-600 via-brand-navy-700 to-brand-orange-600 sm:h-28">
        <div className="pointer-events-none absolute -right-10 -top-14 size-40 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-brand-orange-300/25 blur-3xl" />
      </div>

      <div className="flex flex-col items-center gap-3 px-6 pb-6 text-center sm:flex-row sm:items-end sm:gap-5 sm:px-8 sm:pb-8 sm:text-left">
        <Avatar
          name={user.name ?? user.phone}
          className="-mt-12 size-24 shrink-0 border-4 border-white text-3xl shadow-lg shadow-brand-navy-900/20 dark:border-brand-navy-950 sm:-mt-10 sm:size-24"
        />

        <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start sm:pb-1">
          {editing ? (
            <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-sm">
              <Label>
                {tc("name")}
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("fallbackName")} />
              </Label>
              <Label>
                {tc("email")}
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                />
              </Label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-center gap-2 sm:justify-start">
                <Button type="button" size="sm" loading={saving} onClick={handleSave}>
                  <Check className="size-3.5" />
                  {saving ? tc("saving") : tc("save")}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  <X className="size-3.5" />
                  {tc("cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">{user.name ?? t("fallbackName")}</h1>
                {user.isVerified && (
                  <Badge variant="success">
                    <BadgeCheck className="size-3.5" />
                    {tc("verified")}
                  </Badge>
                )}
                {user.isTrusted && (
                  <Badge variant="brand">
                    <ShieldCheck className="size-3.5" />
                    {t("trusted")}
                  </Badge>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Phone className="size-3.5" />
                {user.phone}
              </p>
              {user.email && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>}
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={startEditing}>
                <Pencil className="size-3.5" />
                {t("editProfile")}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function ProfilePage() {
  const t = useTranslations("profilePage");
  const queryClient = useQueryClient();

  async function handleLogout() {
    await logout();
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  }

  return (
    <RequireAuth>
      {(user) => (
        <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <BackgroundBubbles />
          <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />

          <Reveal delay={0}>
            <div className="mt-6">
              <ProfileHeader user={user} />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <Card className="mt-4 flex flex-col divide-y divide-black/5 p-0 dark:divide-white/5">
              <div className="flex items-center gap-3 p-4 text-sm">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300">
                  <CalendarDays className="size-4" />
                </span>
                <span className="text-slate-500 dark:text-slate-400">{t("memberSince")}</span>
                <span className="ml-auto font-medium text-foreground">
                  {new Date(user.memberSince).toLocaleDateString()}
                </span>
              </div>
              <Link
                href="/addresses"
                className="group flex items-center gap-3 p-4 text-sm transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300">
                  <MapPin className="size-4" />
                </span>
                <span className="font-medium text-brand-navy-700 dark:text-brand-orange-400">
                  {t("manageAddresses")}
                </span>
                <ChevronRight className="ml-auto size-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Card>
          </Reveal>

          <Reveal delay={0.12}>
            <Card className="mt-4 flex items-center gap-3 p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300">
                <Bell className="size-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t("notifications")}</p>
                <PushToggle />
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.18}>
            <Button variant="outline" className="mt-6 text-red-600 hover:bg-red-500/10" onClick={handleLogout}>
              <LogOut className="size-4" />
              {t("logOut")}
            </Button>
          </Reveal>
        </div>
      )}
    </RequireAuth>
  );
}
