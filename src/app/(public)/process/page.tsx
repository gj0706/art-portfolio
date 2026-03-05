import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ArtworkWithMedia } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process | Art Portfolio",
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Process</h1>
        <p className="text-gray-500">
          Behind the scenes: sketches, iterations, and the story behind each
          piece.
        </p>
      </div>

      <div className="space-y-12">
        {processArtworks.map((artwork) => (
          <div key={artwork.id} className="border rounded-xl p-6 bg-white">
            <Link
              href={`/gallery/${artwork.slug}`}
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {artwork.title}
            </Link>

            {artwork.story && (
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {artwork.story}
              </p>
            )}

            {artwork.artwork_media && artwork.artwork_media.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {artwork.artwork_media
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((media, index) => (
                    <div key={media.id} className="relative">
                      <img
                        src={media.url}
                        alt={
                          media.alt_text ||
                          `${artwork.title} - step ${index + 1}`
                        }
                        className="w-full rounded-lg object-cover aspect-square"
                        loading="lazy"
                      />
                      {media.caption && (
                        <p className="text-xs text-gray-500 mt-1">
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
        <p className="text-center text-gray-400 py-20">
          Process content coming soon! Check back later for behind-the-scenes
          looks at the creative journey.
        </p>
      )}
    </div>
  );
}
