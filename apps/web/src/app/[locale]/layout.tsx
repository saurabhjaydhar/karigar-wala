import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LocaleHtmlSync } from "@/components/providers/locale-html-sync";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsappBubble } from "@/components/layout/whatsapp-bubble";
import { AuthModal } from "@/components/features/auth/auth-modal";
import { InstallPrompt } from "@/components/features/pwa/install-prompt";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <LocaleHtmlSync />
      <div className="flex flex-1">
        <SiteSidebar />
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1">
            {children}
            <SiteFooter />
          </main>
          <BottomNav />
        </div>
      </div>
      <WhatsappBubble />
      <AuthModal />
      <InstallPrompt />
    </NextIntlClientProvider>
  );
}
