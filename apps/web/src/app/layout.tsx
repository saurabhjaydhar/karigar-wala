import type { Metadata } from "next";
import { Baloo_2, Mukta, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { SerwistProvider } from "@serwist/turbopack/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const baloo = Baloo_2({
  variable: "--font-heading",
  subsets: ["latin", "devanagari"],
  weight: ["500", "600", "700", "800"],
});

const mukta = Mukta({
  variable: "--font-body",
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karigar Saathi — Book Trusted Local Karigars",
  description: "Hyperlocal home-services marketplace connecting customers to verified local tradespeople.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Karigar Saathi",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// This layout sits above the `[locale]` segment on purpose: providers here
// (theme, query cache, service worker) must survive a locale switch, which
// changes the `[locale]` param and would otherwise remount everything below
// it — losing query cache/theme state and, with next-themes specifically,
// triggering a "script tag rendered on client" warning since its no-flash
// script is only safe to render as part of the initial server HTML, not a
// fresh client-side mount.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${baloo.variable} ${mukta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV === "development"}>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </SerwistProvider>
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
