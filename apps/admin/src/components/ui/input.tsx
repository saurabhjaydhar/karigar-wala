import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type LabelHTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-xl border border-black/10 bg-white/80 px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-slate-400 focus:border-brand-navy-400 focus:ring-4 focus:ring-brand-navy-400/15 dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-brand-navy-300 disabled:opacity-50 disabled:pointer-events-none";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldClasses, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn(fieldClasses, "appearance-none bg-no-repeat pr-8", className)} {...props} />
  ),
);
Select.displayName = "Select";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldClasses, "resize-none", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("flex flex-col gap-1.5 text-sm font-medium text-foreground/90", className)}
      {...props}
    />
  );
}
