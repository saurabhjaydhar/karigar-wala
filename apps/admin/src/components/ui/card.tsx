import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "glass";
}

export function Card({ className, variant = "solid", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4",
        variant === "solid" && "border border-black/10 bg-surface dark:border-white/10",
        variant === "glass" &&
          "border border-white/40 bg-white/60 shadow-sm shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]",
        className,
      )}
      {...props}
    />
  );
}
