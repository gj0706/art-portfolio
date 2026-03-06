"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost } from "@/actions/blog-posts";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { generateSlug } from "@/lib/utils";
import type { BlogPost } from "@/types";
import type { JSONContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
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

interface BlogPostFormProps {
  post?: BlogPost;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState<JSONContent>(
    (post?.content as JSONContent) || {}
  );
  const [contentHtml, setContentHtml] = useState(post?.content_html || "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    post?.cover_image_url || ""
  );
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!post) setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const data = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      content_html: contentHtml || undefined,
      cover_image_url: coverImageUrl || undefined,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      status,
      published_at:
        status === "published" && !post?.published_at
          ? new Date().toISOString()
          : post?.published_at || undefined,
    };

    const result = post
      ? await updateBlogPost(post.id, data)
      : await createBlogPost(data);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
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
              placeholder="Write your blog post..."
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
            <Label>Cover Image URL</Label>
            <Input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="art, process, reflection"
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
              {saving ? "Saving..." : post ? "Update" : "Create"}
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
