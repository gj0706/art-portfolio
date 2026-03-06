"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArtwork, updateArtwork, addArtworkMedia } from "@/actions/artworks";
import { Dropzone } from "@/components/upload/dropzone";
import { ARTWORK_MEDIUMS } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";
import type { Artwork, ArtworkMedia } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ArtworkFormProps {
  artwork?: Artwork & {
    artwork_media?: ArtworkMedia[];
    artwork_collections?: { collection_id: string }[];
  };
  collections: { id: string; title: string }[];
}

export function ArtworkForm({ artwork, collections }: ArtworkFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(artwork?.title || "");
  const [slug, setSlug] = useState(artwork?.slug || "");
  const [description, setDescription] = useState(artwork?.description || "");
  const [medium, setMedium] = useState(artwork?.medium || "other");
  const [ageCreated, setAgeCreated] = useState(
    artwork?.age_created?.toString() || ""
  );
  const [yearCreated, setYearCreated] = useState(
    artwork?.year_created?.toString() || ""
  );
  const [dimensions, setDimensions] = useState(artwork?.dimensions || "");
  const [tags, setTags] = useState(artwork?.tags?.join(", ") || "");
  const [story, setStory] = useState(artwork?.story || "");
  const [isFeatured, setIsFeatured] = useState(artwork?.is_featured || false);
  const [status, setStatus] = useState(artwork?.status || "published");
  const [uploadedMedia, setUploadedMedia] = useState<
    { cdnUrl: string; key: string; filename: string }[]
  >([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    artwork?.artwork_collections?.map((entry) => entry.collection_id) || []
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!artwork) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("description", description);
    formData.set("medium", medium);
    if (ageCreated) formData.set("age_created", ageCreated);
    if (yearCreated) formData.set("year_created", yearCreated);
    if (dimensions) formData.set("dimensions", dimensions);
    formData.set("tags", tags);
    if (story) formData.set("story", story);
    formData.set("is_featured", String(isFeatured));
    formData.set("status", status);
    selectedCollectionIds.forEach((collectionId) => {
      formData.append("collection_ids", collectionId);
    });

    let result;
    if (artwork) {
      result = await updateArtwork(artwork.id, formData);
    } else {
      result = await createArtwork(formData);
    }

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
      setSaving(false);
      return;
    }

    // Add uploaded media to the artwork
    const artworkId = artwork?.id || (result as { id: string }).id;
    for (const media of uploadedMedia) {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(media.filename);
      await addArtworkMedia(artworkId, {
        media_type: isImage ? "image" : "video",
        url: media.cdnUrl,
        r2_key: media.key,
        thumbnail_url: null,
        blurhash: null,
        width: null,
        height: null,
        file_size: null,
        mime_type: null,
        alt_text: null,
        caption: null,
        is_primary: uploadedMedia.indexOf(media) === 0 && !artwork?.artwork_media?.length,
        sort_order: uploadedMedia.indexOf(media),
        video_embed_url: null,
        video_duration: null,
      });
    }

    setSaving(false);
    router.push("/admin/artworks");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Title */}
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title[0]}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>

      {/* Medium + Year + Age Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Medium *</Label>
          <Select value={medium} onValueChange={(value) => setMedium(value as typeof medium)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ARTWORK_MEDIUMS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Year Created</Label>
          <Input
            type="number"
            value={yearCreated}
            onChange={(e) => setYearCreated(e.target.value)}
            min="2000"
            max="2040"
          />
        </div>
        <div className="space-y-2">
          <Label>Age When Created</Label>
          <Input
            type="number"
            value={ageCreated}
            onChange={(e) => setAgeCreated(e.target.value)}
            min="0"
            max="25"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Dimensions */}
      <div className="space-y-2">
        <Label>Dimensions</Label>
        <Input
          type="text"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          placeholder='e.g., 8x10 inches'
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (comma-separated)</Label>
        <Input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="portrait, landscape, abstract"
        />
      </div>

      {/* Story */}
      <div className="space-y-2">
        <Label>Behind the Scenes Story</Label>
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          placeholder="Share the story behind this artwork..."
        />
      </div>

      {/* Status + Featured */}
      <div className="flex items-center gap-6">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 mt-5">
          <Checkbox
            checked={isFeatured}
            onCheckedChange={(checked) => setIsFeatured(checked === true)}
          />
          <Label className="font-normal">Featured</Label>
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-2">
        <Label>Collections</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {collections.map((collection) => {
            const checked = selectedCollectionIds.includes(collection.id);
            return (
              <div
                key={collection.id}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground/80"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(checkedState) => {
                    setSelectedCollectionIds((prev) =>
                      checkedState === true
                        ? [...prev, collection.id]
                        : prev.filter((id) => id !== collection.id)
                    );
                  }}
                />
                <Label className="font-normal">{collection.title}</Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Existing Media */}
      {artwork?.artwork_media && artwork.artwork_media.length > 0 && (
        <div className="space-y-2">
          <Label>Current Media</Label>
          <div className="grid grid-cols-4 gap-3">
            {artwork.artwork_media.map((m) => (
              <div key={m.id} className="relative group">
                <img
                  src={m.url}
                  alt={m.alt_text || ""}
                  className="h-24 w-full object-cover rounded-lg"
                />
                {m.is_primary && (
                  <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Media */}
      <div className="space-y-2">
        <Label>Upload Media</Label>
        <Dropzone
          folder="artworks"
          onUploadComplete={(result) => {
            setUploadedMedia((prev) => [...prev, result]);
          }}
        />
        {uploadedMedia.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {uploadedMedia.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded"
              >
                {m.filename}
                <button
                  type="button"
                  onClick={() =>
                    setUploadedMedia((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Errors */}
      {errors._form && (
        <p className="text-sm text-destructive bg-red-50 p-3 rounded">
          {errors._form[0]}
        </p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : artwork
            ? "Update Artwork"
            : "Create Artwork"}
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
