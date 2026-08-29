"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENTS = [
  {
    badge: "from-brand-navy-600 to-brand-navy-800",
    ring: "shadow-brand-navy-900/25",
    border: "border-brand-navy-300/60 dark:border-brand-navy-400/30",
  },
  {
    badge: "from-brand-orange-500 to-brand-orange-600",
    ring: "shadow-brand-orange-600/25",
    border: "border-brand-orange-300/60 dark:border-brand-orange-400/30",
  },
] as const;

export function AccordionItem({
  title,
  index = 0,
  children,
}: {
  title: string;
  index?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-surface transition-colors duration-200",
        open ? accent.border : "border-black/10 dark:border-white/10",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03] sm:px-5"
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm transition-transform duration-300",
            accent.badge,
            accent.ring,
            open && "scale-110",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform duration-300",
            open && "rotate-180 text-foreground",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 px-4 pb-4 sm:px-5">
              <span aria-hidden className="w-8 shrink-0" />
              <p className={cn("border-l-2 pl-3 text-sm text-slate-600 dark:text-slate-400", accent.border)}>
                {children}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
