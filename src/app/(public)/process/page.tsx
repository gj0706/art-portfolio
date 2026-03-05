import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { ArtworkWithMedia } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process | Anna's Art Adventure",
  description: "Behind the scenes: sketches, iterations, and the creative process.",
};

export default async function ProcessPage() {
  const supabase = await createClient();

  // Get artworks that have multiple media (showing process/iterations)
  const { data: artworks } = await supabase
    .from("artworks")
    .select("*, artwork_media(*)")
    .eq("status", "published")
    .not("story", "is", null)
    .order("created_at", { ascending: false });

  // Filter to those with stories or multiple media
  const processArtworks = ((artworks as ArtworkWithMedia[]) || []).filter(
    (a) => a.story || (a.artwork_media && a.artwork_media.length > 1)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-foreground mb-2">Process</h1>
        <p className="text-muted-foreground">
          Behind the scenes: sketches, iterations, and the story behind each
          piece.
        </p>
      </div>

      <div className="space-y-12">
        {processArtworks.map((artwork) => (
          <div key={artwork.id} className="rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-sm">
            <Link
              href={`/gallery/${artwork.slug}`}
              className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              {artwork.title}
            </Link>

            {artwork.story && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {artwork.story}
              </p>
            )}

            {artwork.artwork_media && artwork.artwork_media.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {artwork.artwork_media
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((media, index) => (
                    <div key={media.id} className="relative">
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        <Image
                          src={media.url}
                          alt={
                            media.alt_text ||
                            `${artwork.title} - step ${index + 1}`
                          }
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      {media.caption && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {media.caption}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {processArtworks.length === 0 && (
        <p className="text-center text-muted-foreground/70 py-20">
          Process content coming soon! Check back later for behind-the-scenes
          looks at the creative journey.
        </p>
      )}
    </div>
  );
}
