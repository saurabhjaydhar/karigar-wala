import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-500 to-brand-navy-700 font-semibold text-white",
        className,
      )}
    >
      {initialsOf(name) || "?"}
    </div>
  );
}
