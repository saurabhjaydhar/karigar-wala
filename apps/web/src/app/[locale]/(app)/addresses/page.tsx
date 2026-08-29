"use client";

import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { RequireAuth } from "@/components/features/auth/require-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { useMyAddresses } from "@/hooks/use-my-addresses";
import { createAddress, deleteAddress, type AddressRecord } from "@/lib/api/addresses";
import { ApiError } from "@/lib/api-client";

function AddressCard({ address }: { address: AddressRecord }) {
  const tc = useTranslations("common");
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAddress(address._id);
      await queryClient.invalidateQueries({ queryKey: ["addresses", "me"] });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300">
          <MapPin className="size-4" />
        </span>
        <div className="text-sm">
          <p className="font-semibold text-foreground">{address.label}</p>
          <p className="text-slate-500 dark:text-slate-400">{address.line}</p>
          <p className="text-slate-500 dark:text-slate-400">
            {address.area}, {address.city}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 text-red-600 hover:bg-red-500/10"
        loading={deleting}
        onClick={handleDelete}
      >
        {deleting ? tc("removing") : tc("remove")}
      </Button>
    </Card>
  );
}

function AddAddressForm({ onDone }: { onDone: () => void }) {
  const t = useTranslations("addressesPage");
  const tc = useTranslations("common");
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("Home");
  const [line, setLine] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!line.trim() || !area.trim() || !city.trim()) {
      setError(t("validationError"));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createAddress({ label: label || "Home", line, area, city });
      await queryClient.invalidateQueries({ queryKey: ["addresses", "me"] });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("couldNotSave"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Label>
            {t("label")}
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </Label>
          <Label>
            {tc("city")}
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </Label>
        </div>
        <Label>
          {tc("area")}
          <Input value={area} onChange={(e) => setArea(e.target.value)} />
        </Label>
        <Label>
          {tc("addressLine")}
          <Input value={line} onChange={(e) => setLine(e.target.value)} placeholder={tc("houseNoStreet")} />
        </Label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" loading={submitting}>
            {submitting ? tc("saving") : "Save address"}
          </Button>
          <Button type="button" variant="ghost" onClick={onDone}>
            {tc("cancel")}
          </Button>
        </div>
      </Card>
    </form>
  );
}

function AddressesList() {
  const t = useTranslations("addressesPage");
  const { data: addresses, isLoading } = useMyAddresses();
  const [adding, setAdding] = useState(false);

  if (isLoading) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {!addresses?.length && !adding && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("empty")}</p>
      )}
      {addresses?.map((address, i) => (
        <Reveal key={address._id} delay={Math.min(i * 0.05, 0.3)}>
          <AddressCard address={address} />
        </Reveal>
      ))}
      <AnimatePresence mode="wait">
        {adding ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AddAddressForm onDone={() => setAdding(false)} />
          </motion.div>
        ) : (
          <Button
            key="cta"
            type="button"
            variant="secondary"
            className="self-start"
            onClick={() => setAdding(true)}
          >
            <Plus className="size-4" />
            {t("addAddress")}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AddressesPage() {
  const t = useTranslations("addressesPage");
  return (
    <RequireAuth>
      {() => (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
          <AddressesList />
        </div>
      )}
    </RequireAuth>
  );
}
