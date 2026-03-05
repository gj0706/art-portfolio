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
    .select("*, artwork_media(*)")
    .eq("id", id)
    .single();

  if (!artwork) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Artwork</h1>
      <ArtworkForm artwork={artwork} />
    </div>
  );
}
