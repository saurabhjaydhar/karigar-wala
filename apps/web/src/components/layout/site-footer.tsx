import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MessageCircle, Heart, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

const COLUMNS = [
  {
    headingKey: "headingCompany" as const,
    links: [
      { href: "/about-us", labelKey: "aboutUs" },
      { href: "/how-it-works", labelKey: "howItWorks" },
      { href: "/safety", labelKey: "safety" },
      { href: "/partner-with-us", labelKey: "partnerWithUs" },
    ],
  },
  {
    headingKey: "headingSupport" as const,
    links: [
      { href: "/faq", labelKey: "faq" },
      { href: "/contact", labelKey: "contactUs" },
    ],
  },
  {
    headingKey: "headingLegal" as const,
    links: [
      { href: "/terms", labelKey: "termsOfService" },
      { href: "/privacy", labelKey: "privacyPolicy" },
    ],
  },
];

export async function SiteFooter() {
  const t = await getTranslations("nav");
  const tf = await getTranslations("footer");

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-brand-orange-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-brand-navy-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 2xl:max-w-[96rem] 2xl:px-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image src="/icon-192.png" alt="" width={32} height={32} className="rounded-xl shadow-sm" />
              <span className="text-lg font-bold text-white">Karigar Saathi</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-white/60">{tf("tagline")}</p>
            {WHATSAPP_NUMBER && (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("chatOnWhatsapp")}
                className="mt-4 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-[#25D366] hover:text-white"
              >
                <MessageCircle className="size-4" fill="currentColor" strokeWidth={0} />
              </a>
            )}
          </div>
          {COLUMNS.map((col) => (
            <div key={col.headingKey}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{tf(col.headingKey)}</p>
              <nav className="mt-3 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {t(link.labelKey)}
                    <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Karigar Saathi. {tf("rightsReserved")}
          </p>
          <p className="flex items-center gap-1">
            {tf("madeInIndia")}
            <Heart className="size-3 fill-brand-orange-400 text-brand-orange-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}
