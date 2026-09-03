"use client";

import { motion } from "framer-motion";
import { CloudOff } from "lucide-react";
import { RetryButton } from "@/components/ui/retry-button";

const RINGS = [0, 0.5, 1] as const;

export function SectionError({
  title,
  message,
  retryLabel,
}: {
  title: string;
  message: string;
  retryLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-black/10 bg-gradient-to-b from-surface to-brand-navy-50/40 px-6 py-10 text-center dark:border-white/10 dark:to-white/[0.03]">
      <span className="relative flex size-14 items-center justify-center">
        {RINGS.map((delay) => (
          <motion.span
            key={delay}
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-brand-navy-500/40 dark:border-brand-orange-400/40"
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay }}
          />
        ))}
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-lg shadow-brand-navy-900/20"
        >
          <CloudOff className="size-5" />
        </motion.span>
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      <RetryButton label={retryLabel} />
    </div>
  );
}
