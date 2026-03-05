import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { WRITING_TYPES } from "@/lib/constants";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing | Art Portfolio",
  description: "Poems, reflections, essays, and stories.",
};

export default async function WritingPage() {
  const supabase = await createClient();
  const { data: pieces } = await supabase
    .from("writing_pieces")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Writing</h1>
        <p className="text-muted-foreground">Poems, reflections, essays, and stories.</p>
      </div>

      <div className="space-y-6">
        {pieces?.map((piece) => {
          const typeLabel = WRITING_TYPES.find(
            (t) => t.value === piece.writing_type
          )?.label;

          return (
            <Link
              key={piece.id}
              href={`/writing/${piece.slug}`}
              className="group block p-5 bg-card rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {piece.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground/70">
                    {typeLabel && (
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                        {typeLabel}
                      </span>
                    )}
                    {piece.published_externally && piece.publication_name && (
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <ExternalLink className="h-3 w-3" />
                        {piece.publication_name}
                      </span>
                    )}
                    <time className="text-xs">
                      {piece.published_at
                        ? formatDate(piece.published_at)
                        : formatDate(piece.created_at)}
                    </time>
                  </div>
                  {piece.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {piece.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {(!pieces || pieces.length === 0) && (
        <p className="text-center text-muted-foreground/70 py-20">
          No writing pieces yet. Check back soon!
        </p>
      )}
    </div>
  );
}
