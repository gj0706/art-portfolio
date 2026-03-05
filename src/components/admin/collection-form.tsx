"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCollection, updateCollection } from "@/actions/collections";
import { COLLECTION_TYPES } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";
import type { Collection } from "@/types";

interface CollectionFormProps {
  collection?: Collection;
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(collection?.title || "");
  const [slug, setSlug] = useState(collection?.slug || "");
  const [description, setDescription] = useState(collection?.description || "");
  const [collectionType, setCollectionType] = useState(
    collection?.collection_type || "theme"
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    collection?.cover_image_url || ""
  );
  const [sortOrder, setSortOrder] = useState(
    collection?.sort_order?.toString() || "0"
  );
  const [isVisible, setIsVisible] = useState(collection?.is_visible ?? true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!collection) setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("description", description);
    formData.set("collection_type", collectionType);
    formData.set("cover_image_url", coverImageUrl);
    formData.set("sort_order", sortOrder);
    formData.set("is_visible", String(isVisible));

    const result = collection
      ? await updateCollection(collection.id, formData)
      : await createCollection(formData);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
      setSaving(false);
      return;
    }

    router.push("/admin/collections");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">Type *</label>
        <select
          value={collectionType}
          onChange={(e) => setCollectionType(e.target.value as typeof collectionType)}
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {COLLECTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">Cover Image URL</label>
        <input
          type="text"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-24 px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <label className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm text-foreground/80">Visible</span>
        </label>
      </div>

      {errors._form && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{errors._form[0]}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : collection ? "Update Collection" : "Create Collection"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-border text-foreground/80 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
