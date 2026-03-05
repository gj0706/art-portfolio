"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArtwork, updateArtwork, addArtworkMedia } from "@/actions/artworks";
import { Dropzone } from "@/components/upload/dropzone";
import { ARTWORK_MEDIUMS } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";
import type { Artwork, ArtworkMedia } from "@/types";
import { X } from "lucide-react";

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
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
        )}
      </div>

      {/* Slug */}
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

      {/* Medium + Year + Age Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Medium *
          </label>
          <select
            value={medium}
            onChange={(e) => setMedium(e.target.value as typeof medium)}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {ARTWORK_MEDIUMS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Year Created
          </label>
          <input
            type="number"
            value={yearCreated}
            onChange={(e) => setYearCreated(e.target.value)}
            min="2000"
            max="2040"
            className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Age When Created
          </label>
          <input
            type="number"
            value={ageCreated}
            onChange={(e) => setAgeCreated(e.target.value)}
            min="0"
            max="25"
            className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Dimensions */}
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">
          Dimensions
        </label>
        <input
          type="text"
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          placeholder='e.g., 8x10 inches'
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="portrait, landscape, abstract"
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Story */}
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">
          Behind the Scenes Story
        </label>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          placeholder="Share the story behind this artwork..."
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Status + Featured */}
      <div className="flex items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm text-foreground/80">Featured</span>
        </label>
      </div>

      {/* Collections */}
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-2">
          Collections
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {collections.map((collection) => {
            const checked = selectedCollectionIds.includes(collection.id);
            return (
              <label
                key={collection.id}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground/80"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setSelectedCollectionIds((prev) =>
                      e.target.checked
                        ? [...prev, collection.id]
                        : prev.filter((id) => id !== collection.id)
                    );
                  }}
                  className="h-4 w-4 rounded border-border"
                />
                <span>{collection.title}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Existing Media */}
      {artwork?.artwork_media && artwork.artwork_media.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Current Media
          </label>
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
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-2">
          Upload Media
        </label>
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
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {errors._form[0]}
        </p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving
            ? "Saving..."
            : artwork
            ? "Update Artwork"
            : "Create Artwork"}
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
