"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/api/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function checkSupport() {
  if (typeof window === "undefined") return false;
  return Boolean(VAPID_PUBLIC_KEY) && "serviceWorker" in navigator && "PushManager" in window;
}

export function PushToggle() {
  const t = useTranslations("pushToggle");
  const [supported] = useState(checkSupport);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((sub) => setSubscribed(Boolean(sub)))
      .catch(() => {});
  }, [supported]);

  async function handleEnable() {
    setError(null);
    setBusy(true);
    try {
      if (Notification.permission === "denied") {
        setError(t("blocked"));
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError(t("notGranted"));
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await subscribeToPush(subscription.toJSON());
      setSubscribed(true);
    } catch {
      setError(t("couldNotEnable"));
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    setError(null);
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await unsubscribeFromPush(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setSubscribed(false);
    } catch {
      setError(t("couldNotDisable"));
    } finally {
      setBusy(false);
    }
  }

  if (!supported) return null;

  return (
    <div className="mt-4 flex flex-col gap-1">
      <Button
        type="button"
        variant="secondary"
        loading={busy}
        onClick={subscribed ? handleDisable : handleEnable}
        className="self-start"
      >
        {subscribed ? <BellOff className="size-4" /> : <Bell className="size-4" />}
        {subscribed ? t("disable") : t("enable")}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
