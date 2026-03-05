import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Anna's Art Adventure",
  description: "Thoughts, reflections, and stories about the creative process.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Thoughts, reflections, and stories about the creative process.
        </p>
      </div>

      <div className="space-y-8">
        {posts?.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            {post.cover_image_url && (
              <div className="aspect-[2/1] rounded-xl overflow-hidden mb-4 relative">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-2">
              <time>{post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}</time>
              {post.tags?.length > 0 && (
                <>
                  <span>&middot;</span>
                  <span>{post.tags.join(", ")}</span>
                </>
              )}
            </div>
            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
            )}
          </Link>
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <p className="text-center text-muted-foreground/70 py-20">
          No blog posts yet. Check back soon!
        </p>
      )}
    </div>
  );
}
