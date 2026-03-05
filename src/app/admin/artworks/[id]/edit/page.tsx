import { createClient } from "@/lib/supabase/server";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { notFound } from "next/navigation";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: artwork } = await supabase
    .from("artworks")
    .select("*, artwork_media(*), artwork_collections(collection_id)")
    .eq("id", id)
    .single();
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title")
    .order("title", { ascending: true });

  if (!artwork) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Artwork</h1>
      <ArtworkForm artwork={artwork} collections={collections || []} />
    </div>
  );
}
