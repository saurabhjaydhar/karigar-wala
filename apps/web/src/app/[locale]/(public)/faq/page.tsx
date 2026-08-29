import { HelpCircle } from "lucide-react";
import { fetchPageContent } from "@/lib/api/content";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { AccordionItem } from "@/components/ui/accordion";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const content = await fetchPageContent("faq");

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <BackgroundBubbles />

      <div className="flex flex-col items-start gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy-600 to-brand-navy-800 text-white shadow-lg shadow-brand-navy-900/20">
          <HelpCircle className="size-6" />
        </span>
        <PageHeader title={content.title} subtitle={content.intro} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {content.sections.map((item, i) => (
          <Reveal key={i} delay={Math.min(i * 0.04, 0.3)}>
            <AccordionItem title={item.title ?? ""} index={i}>
              {item.body}
            </AccordionItem>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
