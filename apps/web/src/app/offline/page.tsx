import { WifiOff } from "lucide-react";
import { cookies } from "next/headers";

const STRINGS = {
  en: {
    title: "You're offline",
    body: "Karigar Saathi needs a connection for live bookings and availability. Reconnect and try again — pages you've already visited may still be available.",
  },
  hi: {
    title: "आप ऑफ़लाइन हैं",
    body: "लाइव बुकिंग और उपलब्धता के लिए Karigar Saathi को इंटरनेट कनेक्शन की ज़रूरत है। दोबारा कनेक्ट होकर फिर कोशिश करें — जिन पेजों पर आप पहले जा चुके हैं वे अभी भी उपलब्ध हो सकते हैं।",
  },
};

export default async function OfflinePage() {
  const localeCookie = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = localeCookie === "hi" ? "hi" : "en";
  const t = STRINGS[locale];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-navy-50 text-brand-navy-700 dark:bg-white/5 dark:text-brand-orange-300">
        <WifiOff className="size-5" />
      </span>
      <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">{t.body}</p>
    </div>
  );
}
