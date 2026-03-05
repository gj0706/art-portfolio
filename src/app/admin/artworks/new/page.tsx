import { ArtworkForm } from "@/components/admin/artwork-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewArtworkPage() {
  const supabase = await createClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title")
    .order("title", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Add Artwork</h1>
      <ArtworkForm collections={collections || []} />
    </div>
  );
}
