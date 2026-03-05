import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Post Not Found" };

  return {
    title: `${data.title} | Art Portfolio`,
    description: data.excerpt || `Read "${data.title}"`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const sanitizedHtml = post.content_html
    ? DOMPurify.sanitize(post.content_html)
    : "";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All Posts
      </Link>

      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full rounded-xl mb-8"
        />
      )}

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-3">
            <time>
              {post.published_at
                ? formatDate(post.published_at)
                : formatDate(post.created_at)}
            </time>
            {post.tags?.length > 0 && (
              <>
                <span>&middot;</span>
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
        </div>

        {sanitizedHtml ? (
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : (
          <p className="text-muted-foreground/70 italic">No content yet.</p>
        )}
      </article>

      {/* Comments */}
      <div className="border-t pt-8 mt-12 space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Comments</h2>
        <CommentList commentableType="blog_post" commentableId={post.id} />
        <CommentForm commentableType="blog_post" commentableId={post.id} />
      </div>
    </div>
  );
}
