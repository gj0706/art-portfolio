"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWritingPiece, updateWritingPiece } from "@/actions/writing";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { WRITING_TYPES } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";
import type { WritingPiece } from "@/types";
import type { JSONContent } from "@tiptap/react";

interface WritingFormProps {
  piece?: WritingPiece;
}

export function WritingForm({ piece }: WritingFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(piece?.title || "");
  const [slug, setSlug] = useState(piece?.slug || "");
  const [writingType, setWritingType] = useState(piece?.writing_type || "poem");
  const [content, setContent] = useState<JSONContent>(
    (piece?.content as JSONContent) || {}
  );
  const [contentHtml, setContentHtml] = useState(piece?.content_html || "");
  const [excerpt, setExcerpt] = useState(piece?.excerpt || "");
  const [publicationName, setPublicationName] = useState(
    piece?.publication_name || ""
  );
  const [publishedExternally, setPublishedExternally] = useState(
    piece?.published_externally || false
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    piece?.cover_image_url || ""
  );
  const [status, setStatus] = useState(piece?.status || "draft");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!piece) setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const data = {
      title,
      slug,
      writing_type: writingType,
      content,
      content_html: contentHtml || undefined,
      excerpt: excerpt || undefined,
      publication_name: publicationName || undefined,
      published_externally: publishedExternally,
      cover_image_url: coverImageUrl || undefined,
      status,
      published_at:
        status === "published" && !piece?.published_at
          ? new Date().toISOString()
          : piece?.published_at || undefined,
    };

    const result = piece
      ? await updateWritingPiece(piece.id, data)
      : await createWritingPiece(data);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
      setSaving(false);
      return;
    }

    router.push("/admin/writing");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Content
            </label>
            <TipTapEditor
              content={content}
              onChange={(json, html) => {
                setContent(json);
                setContentHtml(html);
              }}
              placeholder="Write your piece..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Type *
            </label>
            <select
              value={writingType}
              onChange={(e) =>
                setWritingType(e.target.value as typeof writingType)
              }
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {WRITING_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Brief summary..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Publication Name
            </label>
            <input
              type="text"
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value)}
              placeholder="e.g., School Literary Magazine"
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={publishedExternally}
              onChange={(e) => setPublishedExternally(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm text-foreground/80">
              Published externally
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {errors._form && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {errors._form[0]}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : piece ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 border border-border text-foreground/80 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
