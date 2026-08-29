"use client";

import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuthPromptStore } from "@/store/use-auth-prompt-store";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

type Step = "phone" | "otp";

const OTP_LENGTH = 6;

export function AuthModal() {
  const t = useTranslations("auth");
  const isOpen = useAuthPromptStore((s) => s.isOpen);
  const onSuccess = useAuthPromptStore((s) => s.onSuccess);
  const close = useAuthPromptStore((s) => s.close);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [digits, setDigits] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const phone = `+91${digits}`;

  function reset() {
    setStep("phone");
    setDigits("");
    setOtp("");
    setError(null);
    setSubmitting(false);
  }

  function handleClose() {
    reset();
    close();
  }

  function handleContinueAsGuest() {
    reset();
    close();
    router.push("/");
  }

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError(t("invalidPhone"));
      return;
    }
    setSubmitting(true);
    try {
      await sendOtp({ phone });
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("failedSendOtp"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e?: FormEvent, code?: string) {
    e?.preventDefault();
    setError(null);
    const value = code ?? otp;
    if (!/^\d{6}$/.test(value)) {
      setError(t("invalidOtp"));
      return;
    }
    setSubmitting(true);
    try {
      await verifyOtp({ phone, otp: value });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      const resume = onSuccess;
      reset();
      close();
      resume?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("incorrectOtp"));
    } finally {
      setSubmitting(false);
    }
  }

  function setOtpDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = otp.split("");
    next[index] = clean;
    const joined = next.join("").slice(0, OTP_LENGTH);
    setOtp(joined);
    if (clean && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    if (joined.length === OTP_LENGTH) {
      void handleVerifyOtp(undefined, joined);
    }
  }

  function handleOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setOtp(pasted);
    if (pasted.length === OTP_LENGTH) {
      void handleVerifyOtp(undefined, pasted);
    } else {
      otpRefs.current[pasted.length]?.focus();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy-950/60 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl shadow-brand-navy-950/20 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/70"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-brand-orange-400/20 blur-3xl" />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
            >
              <X className="size-4" />
            </button>

            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.form
                  key="phone"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleSendOtp}
                  className="relative flex flex-col gap-4"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-sm">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("signInToContinue")}</h2>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t("otpSubtitle")}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3.5 py-2.5 transition-all focus-within:border-brand-navy-400 focus-within:ring-4 focus-within:ring-brand-navy-400/15 dark:border-white/10 dark:bg-white/[0.04]">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoFocus
                      placeholder={t("mobilePlaceholder")}
                      className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-slate-400"
                      value={digits}
                      onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" loading={submitting} className="w-full">
                    {submitting ? t("sending") : t("sendOtp")}
                  </Button>
                  <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="text-xs text-slate-500 dark:text-slate-400 underline underline-offset-2 hover:text-foreground"
                  >
                    {t("continueAsGuest")}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleVerifyOtp}
                  className="relative flex flex-col gap-4"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 text-white shadow-sm">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("enterCode")}</h2>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t("sentTo", { digits })}</p>
                  </div>
                  <div className="flex justify-between gap-2">
                    {Array.from({ length: OTP_LENGTH }, (_, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        autoFocus={i === 0}
                        value={otp[i] ?? ""}
                        onChange={(e) => setOtpDigit(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        className="size-11 rounded-xl border border-black/10 bg-white/80 text-center text-lg font-semibold text-foreground outline-none transition-all focus:border-brand-navy-400 focus:ring-4 focus:ring-brand-navy-400/15 dark:border-white/10 dark:bg-white/[0.04]"
                      />
                    ))}
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" loading={submitting} className="w-full">
                    {submitting ? t("verifying") : t("verify")}
                  </Button>
                  <button
                    type="button"
                    className="text-xs text-slate-500 dark:text-slate-400 underline underline-offset-2 hover:text-foreground"
                    onClick={() => {
                      setOtp("");
                      setError(null);
                      setStep("phone");
                    }}
                  >
                    {t("changeNumber")}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
