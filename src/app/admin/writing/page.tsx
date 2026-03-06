import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteWritingPiece } from "@/actions/writing";
import { WRITING_TYPES } from "@/lib/constants";
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

export default async function AdminWritingPage() {
  const supabase = await createClient();
  const { data: pieces } = await supabase
    .from("writing_pieces")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Writing</h1>
        <Button asChild>
          <Link href="/admin/writing/new">
            <Plus className="h-4 w-4" />
            New Piece
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-4">Title</TableHead>
              <TableHead className="px-4">Type</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4">Published</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pieces?.map((piece) => {
              const typeLabel = WRITING_TYPES.find(
                (t) => t.value === piece.writing_type
              )?.label;
              return (
                <TableRow key={piece.id}>
                  <TableCell className="px-4 py-3 font-medium text-foreground">
                    {piece.title}
                    {piece.published_externally && piece.publication_name && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        in {piece.publication_name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {typeLabel || piece.writing_type}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={
                        piece.status === "published" ? "default" : "secondary"
                      }
                      className={
                        piece.status === "published"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : undefined
                      }
                    >
                      {piece.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {piece.published_at ? formatDate(piece.published_at) : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/writing/${piece.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteWritingPiece(piece.id);
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
            {(!pieces || pieces.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-12 text-center text-muted-foreground/70">
                  No writing pieces yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
