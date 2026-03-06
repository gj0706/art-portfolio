"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCollection, updateCollection } from "@/actions/collections";
import { COLLECTION_TYPES } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";
import type { Collection } from "@/types";
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
          value={collectionType}
          onValueChange={(value) => setCollectionType(value as typeof collectionType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLLECTION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
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

      <div className="flex items-center gap-6">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2 mt-5">
          <Checkbox
            checked={isVisible}
            onCheckedChange={(checked) => setIsVisible(checked === true)}
          />
          <Label>Visible</Label>
        </div>
      </div>

      {errors._form && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {errors._form[0]}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : collection ? "Update Collection" : "Create Collection"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
