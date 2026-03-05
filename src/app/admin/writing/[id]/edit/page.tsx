import { createClient } from "@/lib/supabase/server";
import { WritingForm } from "@/components/admin/writing-form";
import { notFound } from "next/navigation";

export default async function EditWritingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: piece } = await supabase
    .from("writing_pieces")
    .select("*")
    .eq("id", id)
    .single();

  if (!piece) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Writing Piece</h1>
      <WritingForm piece={piece} />
    </div>
  );
}
