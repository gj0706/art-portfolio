"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { collectionSchema } from "@/lib/validations";

export async function createCollection(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);
  const parsed = collectionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("collections")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { id: data.id };
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);
  const parsed = collectionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("collections")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath(`/collections/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { success: true };
}

export async function addArtworkToCollection(
  artworkId: string,
  collectionId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("artwork_collections").insert({
    artwork_id: artworkId,
    collection_id: collectionId,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { success: true };
}

export async function removeArtworkFromCollection(
  artworkId: string,
  collectionId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("artwork_collections")
    .delete()
    .eq("artwork_id", artworkId)
    .eq("collection_id", collectionId);

  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return { success: true };
}
