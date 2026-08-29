import { CalendarDays, Mail, HardHat, HelpCircle, Headset, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const CARDS = [
    {
      icon: CalendarDays,
      title: t("bookingQuestionTitle"),
      body: t("bookingQuestionBody"),
      href: "/my-bookings" as const,
      cta: t("goToMyBookings"),
      external: false,
    },
    {
      icon: HardHat,
      title: t("joinTitle"),
      body: t("joinBody"),
      href: "/partner-with-us" as const,
      cta: t("applyHere"),
      external: false,
    },
    {
      icon: HelpCircle,
      title: t("generalQuestionTitle"),
      body: t("generalQuestionBody"),
      href: "/faq" as const,
      cta: t("browseFaq"),
      external: false,
    },
    ...(SUPPORT_EMAIL
      ? [
          {
            icon: Mail,
            title: t("emailUs"),
            body: t("emailUsBody"),
            href: `mailto:${SUPPORT_EMAIL}`,
            cta: SUPPORT_EMAIL,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <BackgroundBubbles />

      <div className="flex flex-col items-start gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-lg shadow-brand-navy-900/20">
          <Headset className="size-6" />
        </span>
        <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const cardClassName = cn(
            "group relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br to-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-brand-navy-900/10 dark:border-white/10 dark:hover:shadow-black/30",
            accent.tint,
          );
          const content = (
            <>
              <card.icon
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
                  "relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110",
                  accent.icon,
                  accent.ring,
                )}
              >
                <card.icon className="size-5" />
              </span>
              <p className="relative font-semibold text-foreground">{card.title}</p>
              <p className="relative flex-1 text-sm text-slate-600 dark:text-slate-400">{card.body}</p>
              <span className="relative flex items-center gap-1 text-sm font-medium text-brand-navy-700 dark:text-brand-orange-400">
                {card.cta}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </>
          );

          return (
            <Reveal key={card.href}>
              {card.external ? (
                <a href={card.href} className={cardClassName}>
                  {content}
                </a>
              ) : (
                <Link href={card.href} className={cardClassName}>
                  {content}
                </Link>
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
