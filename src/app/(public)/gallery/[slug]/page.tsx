import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ARTWORK_MEDIUMS } from "@/lib/constants";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ArtworkWithMedia } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: artwork } = await supabase
    .from("artworks")
    .select("title, description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!artwork) return { title: "Artwork Not Found" };

  return {
    title: `${artwork.title} | Art Portfolio`,
    description: artwork.description || `View "${artwork.title}" artwork`,
  };
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: artwork } = await supabase
    .from("artworks")
    .select("*, artwork_media(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!artwork) notFound();

  const typedArtwork = artwork as ArtworkWithMedia;
  const mediumLabel = ARTWORK_MEDIUMS.find(
    (m) => m.value === typedArtwork.medium
  )?.label;

  // Sort media: primary first, then by sort_order
  const sortedMedia = [...(typedArtwork.artwork_media || [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Gallery
      </Link>

      {/* Images */}
      <div className="space-y-4 mb-8">
        {sortedMedia.map((media) =>
          media.media_type === "video" || media.video_embed_url ? (
            <div
              key={media.id}
              className="aspect-video rounded-xl overflow-hidden bg-gray-100"
            >
              <iframe
                src={media.video_embed_url || media.url}
                className="w-full h-full"
                allowFullScreen
                title={media.caption || typedArtwork.title}
              />
            </div>
          ) : (
            <img
              key={media.id}
              src={media.url}
              alt={media.alt_text || typedArtwork.title}
              className="w-full rounded-xl"
            />
          )
        )}
      </div>

      {/* Info */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {typedArtwork.title}
        </h1>

        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
          {mediumLabel && <span>{mediumLabel}</span>}
          {typedArtwork.year_created && (
            <span>{typedArtwork.year_created}</span>
          )}
          {typedArtwork.age_created && (
            <span>Age {typedArtwork.age_created}</span>
          )}
          {typedArtwork.dimensions && <span>{typedArtwork.dimensions}</span>}
        </div>

        {typedArtwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {typedArtwork.tags.map((tag) => (
              <Link
                key={tag}
                href={`/gallery?tag=${tag}`}
                className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {typedArtwork.description && (
          <p className="text-gray-600 leading-relaxed">
            {typedArtwork.description}
          </p>
        )}

        {typedArtwork.story && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <h2 className="text-sm font-semibold text-amber-800 mb-2">
              Behind the Scenes
            </h2>
            <p className="text-sm text-amber-700 leading-relaxed">
              {typedArtwork.story}
            </p>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="border-t pt-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
        <CommentList
          commentableType="artwork"
          commentableId={typedArtwork.id}
        />
        <CommentForm
          commentableType="artwork"
          commentableId={typedArtwork.id}
        />
      </div>
    </div>
  );
}
