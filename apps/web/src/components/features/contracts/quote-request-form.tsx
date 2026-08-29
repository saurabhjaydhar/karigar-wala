"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthPromptStore } from "@/store/use-auth-prompt-store";
import { requestQuote } from "@/lib/api/contracts";
import { ApiError } from "@/lib/api-client";

export function QuoteRequestForm({ contractorId }: { contractorId: string }) {
  const t = useTranslations("quoteRequest");
  const { data: user } = useCurrentUser();
  const openAuthPrompt = useAuthPromptStore((s) => s.open);
  const [scopeDescription, setScopeDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    setError(null);
    if (scopeDescription.trim().length < 10) {
      setError(t("validationError"));
      return;
    }
    setSubmitting(true);
    try {
      await requestQuote({ contractorId, scopeDescription, photoUrls: [] });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("couldNotSend"));
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    if (!user) {
      openAuthPrompt(() => submit());
      return;
    }
    void submit();
  }

  if (submitted) {
    return (
      <p className="mt-4 rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
        {t("sent")}
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <textarea
        value={scopeDescription}
        onChange={(e) => setScopeDescription(e.target.value)}
        placeholder={t("placeholder")}
        rows={4}
        className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="button" onClick={handleSubmit} disabled={submitting} className="self-start">
        {submitting ? t("sending") : t("requestAQuote")}
      </Button>
    </div>
  );
}
