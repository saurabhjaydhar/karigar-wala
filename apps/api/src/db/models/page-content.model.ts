import { Schema, model } from "mongoose";

export interface PageContentSection {
  title?: string;
  body: string;
}

export interface PageContentLocale {
  title?: string;
  intro?: string;
  sections?: PageContentSection[];
}

export interface PageContentDocument {
  slug: string;
  title: string;
  intro?: string;
  sections: PageContentSection[];
  hi?: PageContentLocale;
  updatedAt: Date;
}

const pageContentSectionSchema = new Schema<PageContentSection>(
  {
    title: { type: String },
    body: { type: String, required: true },
  },
  { _id: false },
);

const pageContentLocaleSchema = new Schema<PageContentLocale>(
  {
    title: { type: String },
    intro: { type: String },
    sections: { type: [pageContentSectionSchema] },
  },
  { _id: false },
);

const pageContentSchema = new Schema<PageContentDocument>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    intro: { type: String },
    sections: { type: [pageContentSectionSchema], default: [] },
    hi: { type: pageContentLocaleSchema },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

export const PageContentModel = model<PageContentDocument>("PageContent", pageContentSchema);
