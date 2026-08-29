import { getTranslations } from "next-intl/server";
import { Star, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { FeaturedReviewItem } from "@/lib/api/reviews";

const TORN_EDGE_CLIP =
  "polygon(0% 3%, 12.5% 0%, 25% 3%, 37.5% 0%, 50% 3%, 62.5% 0%, 75% 3%, 87.5% 0%, 100% 3%, 100% 97%, 87.5% 100%, 75% 97%, 62.5% 100%, 50% 97%, 37.5% 100%, 25% 97%, 12.5% 100%, 0% 97%)";

const ROTATIONS = ["-rotate-1", "rotate-1", "rotate-2", "-rotate-2"] as const;
const TAPE_COLORS = [
  "bg-brand-orange-400/80 dark:bg-brand-orange-500/60",
  "bg-brand-navy-400/70 dark:bg-brand-navy-500/60",
] as const;

export async function CustomerFeedback({ reviews }: { reviews: FeaturedReviewItem[] }) {
  if (reviews.length === 0) return null;

  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
      <Reveal>
        <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">{t("feedbackHeading")}</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {reviews.map((review, i) => {
          const customerName = review.customerId?.name ?? tc("customer");
          return (
            <Reveal key={review._id} delay={Math.min(i * 0.06, 0.3)}>
              <div className="relative h-full">
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 -rotate-3 rounded-[2px] shadow-sm",
                    TAPE_COLORS[i % TAPE_COLORS.length],
                  )}
                />
                <div
                  className={cn(
                    "group relative flex h-full flex-col gap-2.5 bg-[#fdf9ef] p-3 pt-6 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-xl dark:bg-white/[0.05] dark:shadow-black/30 sm:gap-3 sm:p-5 sm:pt-7",
                    ROTATIONS[i % ROTATIONS.length],
                  )}
                  style={{ clipPath: TORN_EDGE_CLIP }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-2 top-0 select-none font-serif text-5xl leading-none text-black/[0.07] dark:text-white/[0.08]"
                  >
                    &rdquo;
                  </span>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }, (_, n) => (
                      <Star key={n} className="size-3.5" fill={n < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="line-clamp-3 text-xs text-stone-700 dark:text-slate-400 sm:text-sm">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-2 border-t border-black/10 pt-2.5 dark:border-white/10 sm:gap-3 sm:pt-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 text-xs font-semibold text-brand-navy-700 dark:from-white/5 dark:to-white/5 dark:text-brand-orange-300 sm:size-9">
                      {customerName.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground sm:text-sm">{customerName}</p>
                      {review.karigarId && (
                        <p className="flex items-center gap-1 truncate text-[0.7rem] text-slate-500 dark:text-slate-400 sm:text-xs">
                          <Wrench className="size-3 shrink-0" />
                          {t("feedbackFor", { name: review.karigarId.name, skill: review.karigarId.primarySkill })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
