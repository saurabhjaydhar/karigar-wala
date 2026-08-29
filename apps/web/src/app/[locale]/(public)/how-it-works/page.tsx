import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/page-header";
import { StepItem } from "@/components/ui/step-item";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";

const STEP_KEYS = ["chooseService", "pickKarigar", "confirmPhone", "getJobDone", "rateExperience"] as const;

export default async function HowItWorksPage() {
  const t = await getTranslations("howItWorksPage");

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <BackgroundBubbles />
      <PageHeader title={t("pageTitle")} />
      <div className="relative mt-8">
        <div
          aria-hidden
          className="absolute bottom-6 left-[19px] top-6 hidden w-px bg-gradient-to-b from-brand-navy-300 to-brand-orange-300 dark:from-brand-navy-500 dark:to-brand-orange-500 sm:block"
        />
        <ol className="flex flex-col gap-6">
          {STEP_KEYS.map((key, i) => (
            <StepItem key={key} index={i} title={t(`${key}Title`)} body={t(`${key}Body`)} />
          ))}
        </ol>
      </div>
    </div>
  );
}
