import { ShieldCheck, PhoneCall, Star, MessageCircleWarning, type LucideIcon } from "lucide-react";
import { fetchPageContent } from "@/lib/api/content";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ICONS: LucideIcon[] = [ShieldCheck, PhoneCall, Star, MessageCircleWarning];

const ACCENTS = [
  {
    icon: "from-brand-navy-600 to-brand-navy-800",
    ring: "shadow-brand-navy-900/25",
    bar: "from-brand-navy-500 to-brand-navy-700",
    tint: "from-brand-navy-50/60 dark:from-white/[0.04]",
    watermark: "text-brand-navy-900/[0.04] dark:text-white/[0.05]",
  },
  {
    icon: "from-brand-orange-500 to-brand-orange-600",
    ring: "shadow-brand-orange-600/25",
    bar: "from-brand-orange-400 to-brand-orange-600",
    tint: "from-brand-orange-50/60 dark:from-white/[0.04]",
    watermark: "text-brand-orange-900/[0.05] dark:text-white/[0.05]",
  },
] as const;

export default async function SafetyPage() {
  const content = await fetchPageContent("safety");

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <BackgroundBubbles />

      <div className="flex flex-col items-start gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-lg shadow-brand-navy-900/20">
          <ShieldCheck className="size-6" />
        </span>
        <PageHeader title={content.title} subtitle={content.intro} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {content.sections.map((point, i) => {
          const Icon = ICONS[i % ICONS.length];
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <Reveal key={i} delay={i * 0.06}>
              <div
                className={cn(
                  "group relative flex h-full flex-col gap-2.5 overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br to-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-brand-navy-900/10 dark:border-white/10 dark:hover:shadow-black/30",
                  accent.tint,
                )}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -bottom-4 -right-4 size-24 rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
                    accent.watermark,
                  )}
                />
                <span
                  aria-hidden
                  className={cn("pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent.bar)}
                />
                <span
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110",
                    accent.icon,
                    accent.ring,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div className="relative">
                  {point.title && <p className="font-semibold text-foreground">{point.title}</p>}
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{point.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
