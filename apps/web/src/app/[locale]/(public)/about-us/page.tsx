import { fetchPageContent } from "@/lib/api/content";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";

export const dynamic = "force-dynamic";

export default async function AboutUsPage() {
  const content = await fetchPageContent("about-us");

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <BackgroundBubbles />
      <PageHeader title={content.title} subtitle={content.intro} />
      <div className="mt-6 flex flex-col gap-4">
        {content.sections.map((section, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <p className="rounded-2xl border border-black/10 bg-surface p-5 text-sm leading-relaxed text-slate-600 dark:border-white/10 dark:text-slate-400">
              {section.body}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
