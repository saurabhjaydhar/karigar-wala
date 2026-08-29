import { getTranslations } from "next-intl/server";

const SECTIONS = [
  {
    title: "What we collect",
    body: "Your phone number (for OTP sign-in, and so an assigned karigar can reach you), name and email if you choose to add them to your profile, service addresses you save or enter while booking, and your booking, review, contract-quote, and karigar/contractor application history. We don't collect payment details — payment happens directly between you and the karigar, off-platform.",
  },
  {
    title: "How it's used",
    body: "Your phone number verifies your identity via OTP and is shared with the karigar or contractor assigned to your booking so they can coordinate the job. Addresses are only used for the bookings you create them for. If you apply as a karigar or contractor, the details you submit (name, phone, skills, experience, areas served) are used to review and, if approved, list your application in the public directory.",
  },
  {
    title: "What karigars and contractors see",
    body: "A karigar or contractor assigned to your booking, or a contractor you've requested a quote from, can see your name, phone number, and the service address for that job — nothing else in your account.",
  },
  {
    title: "Analytics",
    body: "We use Google Analytics to understand site usage, but only if a measurement ID has been configured for this deployment — if it hasn't, no analytics script loads and no usage data is sent anywhere.",
  },
  {
    title: "Who else sees your data",
    body: "We use third-party service providers to run the platform: Twilio to send OTP SMS messages (your phone number is shared with Twilio only for the SMS it sends), and cloud hosting/database providers to run and store the application. We don't sell your personal data to anyone, and we don't share it for third-party marketing.",
  },
  {
    title: "How long we keep it",
    body: "We keep your account and booking history for as long as your account is active, so you can see your booking/review history and karigars can be held accountable for completed work. If you request account deletion, we delete or anonymize your personal data except where we're required to retain records (e.g. for dispute resolution about a specific booking already in progress).",
  },
  {
    title: "Your rights",
    body: "You can view and update your profile information and delete saved addresses at any time from your account. You can request a copy of your data, correction of inaccurate data, or full account deletion by contacting us (see the Contact page) — we'll act on it within a reasonable time and confirm once it's done.",
  },
  {
    title: "Grievance redressal",
    body: "If you have a concern about how your personal data is handled, contact us through the Contact page first. We aim to acknowledge grievances promptly and resolve them within the timelines required under applicable Indian law.",
  },
  {
    title: "Children",
    body: "Karigar Saathi isn't intended for use by anyone under 18. We don't knowingly collect data from minors.",
  },
  {
    title: "Changes to this policy",
    body: "If this policy changes in a way that materially affects how your data is used, we'll update the \"Last updated\" date below and, where appropriate, notify you in-app.",
  },
];

export default async function PrivacyPage() {
  const t = await getTranslations("legal");
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy-800 dark:text-white">
        {t("privacyTitle")}
      </h1>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {t("lastUpdated", { date: "2026-08-27" })}
      </p>
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
        {t("privacyDisclaimer")}
      </p>
      <div className="mt-6 flex flex-col gap-5 text-sm text-slate-600 dark:text-slate-400">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="font-medium text-foreground">{section.title}</p>
            <p className="mt-1">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
