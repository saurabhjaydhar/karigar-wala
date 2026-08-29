"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { fetchReviews, deleteReview } from "@/lib/api/reviews";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: fetchReviews,
  });

  async function handleDelete(id: string) {
    await deleteReview(id);
    await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
  }

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Deleting a review recalculates the karigar's rating automatically."
      />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : !reviews?.length ? (
        <p className="mt-4 text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {reviews.map((r) => (
            <Card key={r._id} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="flex items-center gap-2 font-medium text-foreground">
                  {r.karigarId.name}
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={
                          n <= r.rating
                            ? "size-3.5 text-amber-500"
                            : "size-3.5 text-slate-300 dark:text-slate-600"
                        }
                        fill={n <= r.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                </p>
                <p className="text-slate-500">
                  {r.customerId.name ?? r.customerId.phone}: {r.comment ?? "(no comment)"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-red-600 hover:bg-red-500/10"
                onClick={() => handleDelete(r._id)}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
