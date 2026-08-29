import type { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy-800 dark:text-white sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base lg:text-lg">{subtitle}</p>}
    </div>
  );
}
