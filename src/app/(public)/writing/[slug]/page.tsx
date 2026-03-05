import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { WRITING_TYPES } from "@/lib/constants";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
    .from("writing_pieces")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Writing Not Found" };

  return {
    title: `${data.title} | Art Portfolio`,
    description: data.excerpt || `Read "${data.title}"`,
  };
}

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: piece } = await supabase
    .from("writing_pieces")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!piece) notFound();

  const sanitizedHtml = piece.content_html
    ? DOMPurify.sanitize(piece.content_html)
    : "";

  const typeLabel = WRITING_TYPES.find(
    (t) => t.value === piece.writing_type
  )?.label;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/writing"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All Writing
      </Link>

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            {typeLabel && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {typeLabel}
              </span>
            )}
            {piece.published_externally && piece.publication_name && (
              <span className="flex items-center gap-1 text-xs text-blue-600">
                <ExternalLink className="h-3 w-3" />
                Published in {piece.publication_name}
              </span>
            )}
            <time>
              {piece.published_at
                ? formatDate(piece.published_at)
                : formatDate(piece.created_at)}
            </time>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{piece.title}</h1>
        </div>

        {sanitizedHtml ? (
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : (
          <p className="text-gray-400 italic">No content yet.</p>
        )}
      </article>
    </div>
  );
}
