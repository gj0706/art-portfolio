"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWritingPiece, updateWritingPiece } from "@/actions/writing";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { WRITING_TYPES } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";
import type { WritingPiece } from "@/types";
import type { JSONContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
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
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              value={writingType}
              onValueChange={(value) =>
                setWritingType(value as typeof writingType)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WRITING_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as typeof status)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Brief summary..."
            />
          </div>

          <div className="space-y-2">
            <Label>Publication Name</Label>
            <Input
              type="text"
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value)}
              placeholder="e.g., School Literary Magazine"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={publishedExternally}
              onCheckedChange={(checked) =>
                setPublishedExternally(checked === true)
              }
            />
            <Label>Published externally</Label>
          </div>

          <div className="space-y-2">
            <Label>Cover Image URL</Label>
            <Input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {errors._form && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {errors._form[0]}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving..." : piece ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
