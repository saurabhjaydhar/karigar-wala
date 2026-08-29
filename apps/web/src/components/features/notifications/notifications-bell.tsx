"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellRing } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuthPromptStore } from "@/store/use-auth-prompt-store";
import { markNotificationRead } from "@/lib/api/notifications";

export function NotificationsBell() {
  const t = useTranslations("notifications");
  const tNav = useTranslations("nav");
  const { data: user } = useCurrentUser();
  const openAuthPrompt = useAuthPromptStore((s) => s.open);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications } = useNotifications(Boolean(user));

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  function handleClick() {
    if (!user) {
      openAuthPrompt();
      return;
    }
    setIsOpen((open) => !open);
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={tNav("notifications")}
        className="relative flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
        onClick={handleClick}
      >
        {unreadCount > 0 ? <BellRing className="size-[18px]" /> : <Bell className="size-[18px]" />}
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange-700 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-white/40 bg-white/90 p-2 text-left shadow-xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-brand-navy-950/90"
          >
            {!notifications?.length ? (
              <p className="p-3 text-sm text-slate-500 dark:text-slate-400">{t("empty")}</p>
            ) : (
              <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n._id}>
                    <button
                      type="button"
                      onClick={() => handleMarkRead(n._id)}
                      className={`w-full rounded-xl p-2.5 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
                        n.isRead ? "text-slate-500 dark:text-slate-400" : "font-medium text-foreground"
                      }`}
                    >
                      <p>{n.title}</p>
                      <p className="text-xs font-normal text-slate-500 dark:text-slate-400">{n.message}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
