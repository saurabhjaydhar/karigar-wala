import { HttpError } from "../../utils/http-error";
import { pageContentRepository } from "./page-content.repository";

export const pageContentService = {
  async getBySlug(slug: string, locale?: string) {
    const content = await pageContentRepository.findBySlug(slug);
    if (!content) throw new HttpError(404, "Page content not found");

    if (locale === "hi" && content.hi) {
      return {
        _id: content._id,
        slug: content.slug,
        title: content.hi.title || content.title,
        intro: content.hi.intro || content.intro,
        sections: content.hi.sections?.length ? content.hi.sections : content.sections,
        updatedAt: content.updatedAt,
      };
    }

    return content;
  },
};
