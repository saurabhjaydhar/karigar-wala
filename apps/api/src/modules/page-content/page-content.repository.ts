import type { PageContentInput } from "@karigar-wala/shared";
import { PageContentModel } from "../../db/models/page-content.model";

export const pageContentRepository = {
  findBySlug(slug: string) {
    return PageContentModel.findOne({ slug });
  },

  findAll() {
    return PageContentModel.find().sort({ slug: 1 });
  },

  async upsert(slug: string, input: PageContentInput) {
    return PageContentModel.findOneAndUpdate(
      { slug },
      { slug, ...input },
      { upsert: true, returnDocument: "after" },
    );
  },
};
