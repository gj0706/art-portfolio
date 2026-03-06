import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ARTWORK_MEDIUMS, SITE_CONFIG } from "@/lib/constants";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { FadeIn } from "@/components/motion/fade-in";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ImageProtection } from "@/components/ui/image-protection";
import { VideoProtection } from "@/components/ui/video-protection";
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
    .select("title, description, artwork_media(url, alt_text, is_primary)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!artwork) return { title: "Artwork Not Found" };

  const media = (artwork as any).artwork_media || [];
  const primaryImage = media.find((m: any) => m.is_primary) || media[0];

  return {
    title: `${artwork.title} | Anna's Art Adventure`,
    description: artwork.description || `View "${artwork.title}" artwork`,
    openGraph: primaryImage
      ? { images: [{ url: primaryImage.url, alt: primaryImage.alt_text || artwork.title }] }
      : undefined,
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

  const primaryImage = sortedMedia[0];

  const artworkJsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: typedArtwork.title,
    description: typedArtwork.description || undefined,
    image: primaryImage?.url || undefined,
    dateCreated: typedArtwork.year_created
      ? `${typedArtwork.year_created}`
      : undefined,
    artMedium: mediumLabel || undefined,
    artist: {
      "@type": "Person",
      name: "Anna",
      url: SITE_CONFIG.url,
    },
    copyrightHolder: {
      "@type": "Person",
      name: "Anna",
      url: SITE_CONFIG.url,
    },
    copyrightYear: typedArtwork.year_created || new Date().getFullYear(),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artworkJsonLd) }}
      />

      <Link
        href="/gallery"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Gallery
      </Link>

      {/* Images */}
      <div className="space-y-4 mb-8">
        {sortedMedia.map((media) =>
          media.video_embed_url ? (
            // External embed (YouTube, Vimeo, etc.)
            <div
              key={media.id}
              className="aspect-video rounded-2xl overflow-hidden bg-muted"
            >
              <iframe
                src={media.video_embed_url}
                className="w-full h-full"
                allowFullScreen
                title={media.caption || typedArtwork.title}
              />
            </div>
          ) : media.media_type === "video" ? (
            // Self-hosted video with download prevention
            <VideoProtection
              key={media.id}
              src={media.url}
              poster={media.thumbnail_url}
              title={media.caption || typedArtwork.title}
              className="rounded-2xl"
            />
          ) : (
            // Image with protection + watermark
            <ImageProtection key={media.id} className="rounded-2xl">
              <Image
                src={media.url}
                alt={media.alt_text || typedArtwork.title}
                width={media.width || 0}
                height={media.height || 0}
                sizes="(max-width: 896px) 100vw, 896px"
                className="w-full"
                style={!media.width ? { width: "100%", height: "auto" } : undefined}
                priority={media.is_primary}
              />
            </ImageProtection>
          )
        )}
      </div>

      <p className="text-xs text-muted-foreground/50 mt-2 mb-8">
        &copy; {typedArtwork.year_created || new Date().getFullYear()} Anna&apos;s Art Adventure. All rights reserved. This artwork may not be reproduced without permission.
      </p>

      {/* Info */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-normal text-foreground mb-3">
            {typedArtwork.title}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
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
                  className="text-xs bg-muted/50 text-muted-foreground px-2.5 py-1 rounded-full hover:bg-muted transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {typedArtwork.description && (
            <p className="text-muted-foreground leading-relaxed">
              {typedArtwork.description}
            </p>
          )}

          {typedArtwork.story && (
            <div className="mt-6 p-5 bg-muted/30 rounded-xl">
              <h2 className="text-sm font-semibold text-foreground mb-2">
                Behind the Scenes
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {typedArtwork.story}
              </p>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Comments */}
      <FadeIn delay={0.1}>
        <div className="pt-8 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Comments</h2>
          <CommentList
            commentableType="artwork"
            commentableId={typedArtwork.id}
          />
          <CommentForm
            commentableType="artwork"
            commentableId={typedArtwork.id}
          />
        </div>
      </FadeIn>
    </div>
  );
}
