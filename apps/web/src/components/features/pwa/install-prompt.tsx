"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const t = useTranslations("pwa");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    await deferredPrompt?.prompt();
    await deferredPrompt?.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <AnimatePresence>
      {deferredPrompt && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 left-4 right-4 z-40 flex items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/80 p-3.5 shadow-lg shadow-brand-navy-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/80 sm:left-auto sm:right-4 sm:w-80"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white">
              <Download className="size-4" />
            </span>
            <p className="text-sm text-foreground">{t("installPrompt")}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
              {t("notNow")}
            </Button>
            <Button variant="primary" size="sm" onClick={handleInstall}>
              {t("install")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
