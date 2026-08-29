const IMAGE_BY_SLUG: Record<string, string> = {
  "ac-technician": "/ac-worker.png",
};

export function getCategoryImage(slug: string): string | undefined {
  return IMAGE_BY_SLUG[slug];
}
