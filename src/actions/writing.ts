"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writingSchema } from "@/lib/validations";

export async function createWritingPiece(data: {
  title: string;
  slug: string;
  writing_type: string;
  content: Record<string, unknown>;
  content_html?: string;
  excerpt?: string;
  publication_name?: string;
  published_externally?: boolean;
  cover_image_url?: string;
  status?: string;
  published_at?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = writingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data: piece, error } = await supabase
    .from("writing_pieces")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/writing");
  revalidatePath("/writing");
  return { id: piece.id };
}

export async function updateWritingPiece(
  id: string,
  data: {
    title: string;
    slug: string;
    writing_type: string;
    content: Record<string, unknown>;
    content_html?: string;
    excerpt?: string;
    publication_name?: string;
    published_externally?: boolean;
    cover_image_url?: string;
    status?: string;
    published_at?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = writingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("writing_pieces")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/writing");
  revalidatePath("/writing");
  revalidatePath(`/writing/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteWritingPiece(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("writing_pieces")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/writing");
  revalidatePath("/writing");
  return { success: true };
}
