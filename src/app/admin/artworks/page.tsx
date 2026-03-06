import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteArtwork } from "@/actions/artworks";
import { ARTWORK_MEDIUMS } from "@/lib/constants";
import type { Artwork, ArtworkMedia } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function AdminArtworksPage() {
  const supabase = await createClient();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("*, artwork_media(id, url, is_primary)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Artworks</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="h-4 w-4" />
            Add Artwork
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-4">Artwork</TableHead>
              <TableHead className="px-4">Medium</TableHead>
              <TableHead className="px-4">Year</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4">Created</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(artworks as (Artwork & { artwork_media: ArtworkMedia[] })[] | null)?.map(
              (artwork) => {
                const primaryImage = artwork.artwork_media?.find(
                  (m) => m.is_primary
                );
                const mediumLabel = ARTWORK_MEDIUMS.find(
                  (m) => m.value === artwork.medium
                )?.label;

                return (
                  <TableRow key={artwork.id}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={artwork.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {artwork.title}
                          </p>
                          {artwork.is_featured && (
                            <span className="text-xs text-amber-600">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {mediumLabel || artwork.medium}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {artwork.year_created || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant={
                          artwork.status === "published"
                            ? "default"
                            : artwork.status === "draft"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          artwork.status === "published"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : undefined
                        }
                      >
                        {artwork.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {formatDate(artwork.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/artworks/${artwork.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form
                          action={async () => {
                            "use server";
                            await deleteArtwork(artwork.id);
                          }}
                        >
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
            {(!artworks || artworks.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground/70"
                >
                  No artworks yet. Click &quot;Add Artwork&quot; to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
