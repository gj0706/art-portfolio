"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { artworkSchema } from "@/lib/validations";
import type { ArtworkMedia } from "@/types";

export async function createArtwork(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);
  const tags = formData.get("tags")
    ? (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const isFeatured = formData.get("is_featured") === "true";

  const parsed = artworkSchema.safeParse({ ...raw, tags, is_featured: isFeatured });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("artworks")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  return { id: data.id };
}

export async function updateArtwork(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);
  const tags = formData.get("tags")
    ? (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const isFeatured = formData.get("is_featured") === "true";

  const parsed = artworkSchema.safeParse({ ...raw, tags, is_featured: isFeatured });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("artworks")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteArtwork(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("artworks").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  return { success: true };
}

export async function addArtworkMedia(
  artworkId: string,
  media: Omit<ArtworkMedia, "id" | "artwork_id" | "created_at">
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("artwork_media").insert({
    artwork_id: artworkId,
    ...media,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  return { success: true };
}

export async function removeArtworkMedia(mediaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("artwork_media")
    .delete()
    .eq("id", mediaId);

  if (error) return { error: error.message };

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  return { success: true };
}
