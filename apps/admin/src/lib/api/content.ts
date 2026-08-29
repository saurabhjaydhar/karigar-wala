import { apiFetch } from "@/lib/api-client";

export interface PageContentSection {
  title?: string;
  body: string;
}

export interface PageContentLocale {
  title?: string;
  intro?: string;
  sections?: PageContentSection[];
}

export interface PageContent {
  _id: string;
  slug: string;
  title: string;
  intro?: string;
  sections: PageContentSection[];
  hi?: PageContentLocale;
  updatedAt: string;
}

export function fetchContentList() {
  return apiFetch<PageContent[]>("/admin/content");
}

export function fetchContent(slug: string) {
  return apiFetch<PageContent>(`/admin/content/${slug}`);
}

export function updateContent(
  slug: string,
  input: { title: string; intro?: string; sections: PageContentSection[]; hi?: PageContentLocale },
) {
  return apiFetch<PageContent>(`/admin/content/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
