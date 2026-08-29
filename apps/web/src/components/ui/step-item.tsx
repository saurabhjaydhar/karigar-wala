"use client";

import { motion } from "framer-motion";

export function StepItem({ index, title, body }: { index: number; title?: string; body: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: "easeOut" }}
      className="relative flex gap-4"
    >
      <span className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 to-brand-orange-700 text-sm font-bold text-white shadow-sm">
        {index + 1}
      </span>
      <div className="pt-1.5">
        {title && <p className="font-medium text-foreground">{title}</p>}
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{body}</p>
      </div>
    </motion.li>
  );
}
