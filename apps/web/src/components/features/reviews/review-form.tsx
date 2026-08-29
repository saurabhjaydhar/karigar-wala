"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { createReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api-client";

export function ReviewForm({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  const t = useTranslations("reviews");
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await createReview({ bookingId, rating, comment: comment || undefined });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reviews", "me"] }),
        queryClient.invalidateQueries({ queryKey: ["bookings", "me"] }),
      ]);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("couldNotSubmit"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-2 flex flex-col gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <motion.button
            key={n}
            type="button"
            aria-label={t("starAria", { n })}
            whileTap={{ scale: 0.85 }}
            onClick={() => setRating(n)}
            className={n <= rating ? "text-amber-500" : "text-slate-300 dark:text-slate-600"}
          >
            <Star className="size-5" fill={n <= rating ? "currentColor" : "none"} />
          </motion.button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("optionalComment")}
        rows={2}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="self-start"
        loading={submitting}
        onClick={handleSubmit}
      >
        {submitting ? t("submitting") : t("submitReview")}
      </Button>
    </div>
  );
}
