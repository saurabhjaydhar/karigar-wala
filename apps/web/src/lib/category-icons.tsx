import { createElement, type SVGProps } from "react";
import { HardHat, Wind, Zap, Hammer, Flower2, Wrench, type LucideIcon } from "lucide-react";

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  contractor: HardHat,
  "ac-technician": Wind,
  electrician: Zap,
  "labour-mistri": Hammer,
  gardener: Flower2,
};

// Renders via createElement (not JSX) so a dynamically-looked-up icon
// component doesn't trip the React Compiler's static-components check, which
// flags `const Icon = pick(...); <Icon />` even when the lookup is stable.
export function CategoryIcon({ slug, ...props }: { slug: string } & SVGProps<SVGSVGElement>) {
  return createElement(ICON_BY_SLUG[slug] ?? Wrench, props);
}
