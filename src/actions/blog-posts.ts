"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/validations";

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: Record<string, unknown>;
  content_html?: string;
  cover_image_url?: string;
  tags?: string[];
  status?: string;
  published_at?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { id: post.id };
}

export async function updateBlogPost(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: Record<string, unknown>;
    content_html?: string;
    cover_image_url?: string;
    tags?: string[];
    status?: string;
    published_at?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("blog_posts")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: { _form: [error.message] } };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}
