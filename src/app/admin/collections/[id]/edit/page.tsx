import { createClient } from "@/lib/supabase/server";
import { CollectionForm } from "@/components/admin/collection-form";
import { notFound } from "next/navigation";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (!collection) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Collection</h1>
      <CollectionForm collection={collection} />
    </div>
  );
}
