import { getTranslations } from "next-intl/server";
import { BookingForm } from "@/components/features/booking-form/booking-form";
import { PageHeader } from "@/components/ui/page-header";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";

export default async function BookPage() {
  const t = await getTranslations("booking");
  return (
    <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <BackgroundBubbles />
      <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      <div className="mt-6">
        <BookingForm />
      </div>
    </div>
  );
}
