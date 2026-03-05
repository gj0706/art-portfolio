import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Blog Post</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
