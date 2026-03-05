import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArtworkGrid } from "@/components/gallery/artwork-grid";
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
  const { data } = await supabase
    .from("collections")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!data) return { title: "Collection Not Found" };

  return {
    title: `${data.title} | Anna's Art Adventure`,
    description: data.description || `View the "${data.title}" collection`,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!collection) notFound();

  // Get artworks in this collection
  const { data: artworkCollections } = await supabase
    .from("artwork_collections")
    .select("artwork_id")
    .eq("collection_id", collection.id);

  const artworkIds =
    artworkCollections?.map((ac) => ac.artwork_id) || [];

  let artworks: ArtworkWithMedia[] = [];
  if (artworkIds.length > 0) {
    const { data } = await supabase
      .from("artworks")
      .select("*, artwork_media(*)")
      .in("id", artworkIds)
      .eq("status", "published")
      .order("year_created", { ascending: false });

    artworks = (data as ArtworkWithMedia[]) || [];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All Collections
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-foreground mb-2">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-muted-foreground">{collection.description}</p>
        )}
      </div>

      <ArtworkGrid artworks={artworks} />
    </div>
  );
}
