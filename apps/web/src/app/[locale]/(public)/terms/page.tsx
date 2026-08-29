import { getTranslations } from "next-intl/server";

const SECTIONS = [
  {
    title: "What Karigar Saathi is",
    body: "Karigar Saathi is a booking platform that connects customers with independent karigars and contractors for home-service work. We verify karigars and contractors before they can accept bookings or receive quote requests, but the work itself is performed by the karigar or contractor — they are independent providers, not employees or agents of Karigar Saathi.",
  },
  {
    title: "Eligibility & your account",
    body: "You must be 18 or older to book a service or apply as a karigar/contractor. Accounts are created automatically the first time you verify your phone number by OTP — you're responsible for keeping access to that phone number secure, since it's how bookings are authenticated.",
  },
  {
    title: "Bookings",
    body: "Confirming a booking requires a verified phone number. A booking is either auto-assigned to an available karigar or left pending until one is manually assigned. Cancellations follow the status rules shown on your booking — a booking that's already completed or cancelled can't be cancelled again.",
  },
  {
    title: "Contractor quotes",
    body: "Requesting a quote from a contractor doesn't create a binding booking — it starts a conversation. A contract only becomes active once you accept a quote the contractor has sent you, and either party can cancel it before work begins, subject to the status rules shown on the contract.",
  },
  {
    title: "Payment",
    body: "Payment for completed jobs is made directly to the karigar or contractor, in cash or another method you both agree on, on completion of the work. Karigar Saathi does not process, hold, or take a cut of payments — pricing shown on the platform (starting prices, sub-service prices, contractor quotes) is indicative and the final amount is agreed between you and the provider.",
  },
  {
    title: "Reviews",
    body: "You may leave one review per completed booking. Reviews should reflect your genuine experience with that job; we may remove reviews that are fraudulent, abusive, or unrelated to the actual work performed.",
  },
  {
    title: "Karigar & contractor applications",
    body: "Submitting an application to join as a karigar or contractor does not guarantee approval. We review every application against our verification checklist before a karigar or contractor can appear in the public directory or accept bookings, and we can suspend or remove a listing that violates these terms or receives credible complaints.",
  },
  {
    title: "Prohibited use",
    body: "Don't use fake phone numbers, submit fraudulent bookings or applications, post reviews you didn't genuinely experience, or attempt to circumvent the verification process. We may suspend accounts that violate this.",
  },
  {
    title: "Our role & limitation of liability",
    body: "We verify karigars and contractors through the checklist described on the Safety page and facilitate bookings between you and them, but we aren't a party to the service agreement for the actual work performed. To the fullest extent permitted by law, Karigar Saathi isn't liable for the quality, timing, or outcome of work performed by a karigar or contractor — if something goes wrong on a job, contact us through the Contact page and we'll help mediate, but the underlying dispute is between you and the provider.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms as the platform changes. If we do, we'll update the \"Last updated\" date below — continued use of Karigar Saathi after a change means you accept the updated terms.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of India.",
  },
];

export default async function TermsPage() {
  const t = await getTranslations("legal");
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy-800 dark:text-white">
        {t("termsTitle")}
      </h1>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {t("lastUpdated", { date: "2026-08-27" })}
      </p>
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
        {t("termsDisclaimer")}
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
