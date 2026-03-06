import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteCollection } from "@/actions/collections";
import { COLLECTION_TYPES } from "@/lib/constants";
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

export default async function AdminCollectionsPage() {
  const supabase = await createClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*, artwork_collections(artwork_id)")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Collections</h1>
        <Button asChild>
          <Link href="/admin/collections/new">
            <Plus className="h-4 w-4" />
            Add Collection
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-4">Collection</TableHead>
              <TableHead className="px-4">Type</TableHead>
              <TableHead className="px-4">Artworks</TableHead>
              <TableHead className="px-4">Visible</TableHead>
              <TableHead className="px-4">Created</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections?.map((collection) => {
              const typeLabel = COLLECTION_TYPES.find(
                (t) => t.value === collection.collection_type
              )?.label;
              return (
                <TableRow key={collection.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {collection.cover_image_url ? (
                        <img
                          src={collection.cover_image_url}
                          alt={collection.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted" />
                      )}
                      <span className="font-medium text-foreground">
                        {collection.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">{typeLabel}</TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {collection.artwork_collections?.length || 0}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={collection.is_visible ? "default" : "secondary"}
                      className={
                        collection.is_visible
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : undefined
                      }
                    >
                      {collection.is_visible ? "Visible" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {formatDate(collection.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/collections/${collection.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCollection(collection.id);
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
            })}
            {(!collections || collections.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-12 text-center text-muted-foreground/70">
                  No collections yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
