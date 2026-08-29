import { getLocale } from "next-intl/server";
import { apiFetch } from "@/lib/api-client";
import type { PageContent } from "@/types";

export async function fetchPageContent(slug: string): Promise<PageContent> {
  const locale = await getLocale();
  return apiFetch<PageContent>(`/content/${slug}?locale=${locale}`);
}
