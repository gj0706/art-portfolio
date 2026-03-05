import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Image as ImageIcon, Film, FileImage } from "lucide-react";
import Link from "next/link";

export default async function AdminUploadsPage() {
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("artwork_media")
    .select("*, artworks!inner(id, title, slug)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <p className="text-sm text-muted-foreground">
          {media?.length || 0} file{media?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {media && media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => {
            const artwork = item.artworks as { id: string; title: string; slug: string };
            const MediaIcon =
              item.media_type === "video"
                ? Film
                : item.media_type === "gif" || item.media_type === "animation"
                  ? FileImage
                  : ImageIcon;

            return (
              <div
                key={item.id}
                className="bg-card rounded-xl border overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {item.media_type === "image" || item.media_type === "gif" ? (
                    <img
                      src={item.url}
                      alt={item.alt_text || artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MediaIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                  {item.is_primary && (
                    <span className="absolute top-1.5 left-1.5 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-medium">
                      Primary
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 space-y-1">
                  <Link
                    href={`/admin/artworks/${artwork.id}/edit`}
                    className="text-xs font-medium text-foreground hover:text-primary truncate block"
                    title={artwork.title}
                  >
                    {artwork.title}
                  </Link>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="capitalize">{item.media_type}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  {item.file_size && (
                    <p className="text-[11px] text-muted-foreground/70">
                      {item.file_size >= 1048576
                        ? `${(item.file_size / 1048576).toFixed(1)} MB`
                        : `${Math.round(item.file_size / 1024)} KB`}
                    </p>
                  )}
                  {item.width && item.height && (
                    <p className="text-[11px] text-muted-foreground/70">
                      {item.width} × {item.height}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-xl border px-4 py-12 text-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground/70">
            No media uploaded yet. Upload images through the{" "}
            <Link
              href="/admin/artworks/new"
              className="text-primary hover:text-primary/80 underline"
            >
              artwork forms
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
