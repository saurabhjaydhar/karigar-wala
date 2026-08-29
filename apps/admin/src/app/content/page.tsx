"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea, Label } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchContentList,
  updateContent,
  type PageContent,
  type PageContentSection,
} from "@/lib/api/content";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

function SectionEditor({
  sections,
  onChange,
}: {
  sections: PageContentSection[];
  onChange: (sections: PageContentSection[]) => void;
}) {
  function updateSection(i: number, patch: Partial<PageContentSection>) {
    onChange(sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function removeSection(i: number) {
    onChange(sections.filter((_, idx) => idx !== i));
  }

  function addSection() {
    onChange([...sections, { title: "", body: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => (
        <Card key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Section {i + 1}</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
              onClick={() => removeSection(i)}
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </div>
          <Input
            value={section.title ?? ""}
            onChange={(e) => updateSection(i, { title: e.target.value })}
            placeholder="Title (optional)"
          />
          <Textarea
            value={section.body}
            onChange={(e) => updateSection(i, { body: e.target.value })}
            placeholder="Body"
            rows={3}
          />
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" className="self-start" onClick={addSection}>
        <Plus className="size-3.5" />
        Add section
      </Button>
    </div>
  );
}

function ContentCard({ content }: { content: PageContent }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [title, setTitle] = useState(content.title);
  const [intro, setIntro] = useState(content.intro ?? "");
  const [sections, setSections] = useState<PageContentSection[]>(content.sections);
  const [hiTitle, setHiTitle] = useState(content.hi?.title ?? "");
  const [hiIntro, setHiIntro] = useState(content.hi?.intro ?? "");
  const [hiSections, setHiSections] = useState<PageContentSection[]>(content.hi?.sections ?? []);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setLang("en");
    setTitle(content.title);
    setIntro(content.intro ?? "");
    setSections(content.sections);
    setHiTitle(content.hi?.title ?? "");
    setHiIntro(content.hi?.intro ?? "");
    setHiSections(content.hi?.sections ?? []);
    setError(null);
    setEditing(true);
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const cleanedHiSections = hiSections.filter((s) => s.body.trim());
      const hasHiContent = hiTitle.trim() || hiIntro.trim() || cleanedHiSections.length > 0;
      await updateContent(content.slug, {
        title,
        intro: intro || undefined,
        sections: sections.filter((s) => s.body.trim()),
        hi: hasHiContent
          ? {
              title: hiTitle || undefined,
              intro: hiIntro || undefined,
              sections: cleanedHiSections,
            }
          : undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{content.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            /{content.slug} · {content.sections.length} section
            {content.sections.length === 1 ? "" : "s"} · updated{" "}
            {new Date(content.updatedAt).toLocaleDateString()} ·{" "}
            {content.hi?.title || content.hi?.sections?.length ? "Hindi translated" : "Hindi missing"}
          </p>
        </div>
        {!editing && (
          <Button type="button" variant="outline" size="sm" onClick={startEditing}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
        )}
      </div>

      {editing && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex gap-1 rounded-lg bg-black/[0.04] p-1">
            {(["en", "hi"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setLang(tab)}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
                  lang === tab ? "bg-white text-foreground shadow-sm" : "text-slate-500 hover:text-foreground",
                )}
              >
                {tab === "en" ? "English" : "हिंदी (Hindi)"}
              </button>
            ))}
          </div>

          {lang === "en" ? (
            <>
              <Label>
                Page title
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </Label>
              <Label>
                Intro (optional, shown under the title)
                <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} />
              </Label>
              <SectionEditor sections={sections} onChange={setSections} />
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500">
                Leave any Hindi field blank to fall back to the English version on that field.
              </p>
              <Label>
                Page title (Hindi)
                <Input value={hiTitle} onChange={(e) => setHiTitle(e.target.value)} placeholder={title} />
              </Label>
              <Label>
                Intro (Hindi, optional)
                <Textarea
                  value={hiIntro}
                  onChange={(e) => setHiIntro(e.target.value)}
                  placeholder={intro}
                  rows={2}
                />
              </Label>
              <SectionEditor sections={hiSections} onChange={setHiSections} />
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="button" size="sm" loading={saving} onClick={handleSave}>
              <Save className="size-3.5" />
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
              <X className="size-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function AdminContentPage() {
  const { data: contentList, isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: fetchContentList,
  });

  return (
    <div>
      <PageHeader
        title="Page Content"
        subtitle="Edit the text shown on About Us, Safety, and FAQ without a code deploy."
      />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {contentList?.map((content) => (
            <ContentCard key={content.slug} content={content} />
          ))}
        </div>
      )}
    </div>
  );
}
