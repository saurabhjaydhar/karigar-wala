import type { PageContentInput } from "@karigar-wala/shared";
import { HttpError } from "../../utils/http-error";
import { pageContentRepository } from "../page-content/page-content.repository";
import { recordAuditLog } from "./audit-log";

export const adminContentService = {
  list() {
    return pageContentRepository.findAll();
  },

  async getBySlug(slug: string) {
    const content = await pageContentRepository.findBySlug(slug);
    if (!content) throw new HttpError(404, "Page content not found");
    return content;
  },

  async update(adminId: string, slug: string, input: PageContentInput) {
    const content = await pageContentRepository.upsert(slug, input);
    await recordAuditLog(adminId, "content.update", "PageContent", content!.id, {
      slug,
      title: input.title,
    });
    return content;
  },
};
