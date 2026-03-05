import { createClient } from "@/lib/supabase/server";
import { ArtworkGrid } from "@/components/gallery/artwork-grid";
import { ArtworkFilters } from "@/components/gallery/artwork-filters";
import type { ArtworkWithMedia } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Anna's Art Adventure",
  description: "Browse the complete art collection from age 2 to today.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ medium?: string; year?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("artworks")
    .select("*, artwork_media(*)")
    .eq("status", "published")
    .order("year_created", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (params.medium) {
    query = query.eq("medium", params.medium);
  }
  if (params.year) {
    query = query.eq("year_created", parseInt(params.year));
  }
  if (params.tag) {
    query = query.contains("tags", [params.tag]);
  }

  const { data: artworks } = await query;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-foreground mb-2">Gallery</h1>
        <p className="text-muted-foreground">
          A collection of artwork from age 2 to today.
        </p>
      </div>

      <ArtworkFilters />

      <ArtworkGrid artworks={(artworks as ArtworkWithMedia[]) || []} />
    </div>
  );
}
