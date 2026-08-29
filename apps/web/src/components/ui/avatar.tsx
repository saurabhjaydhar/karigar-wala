import Image from "next/image";
import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-navy-500 to-brand-navy-700 font-semibold text-white",
        className,
      )}
    >
      {src ? <Image src={src} alt={name} fill sizes="96px" className="object-cover" /> : (initialsOf(name) || "?")}
    </div>
  );
}
