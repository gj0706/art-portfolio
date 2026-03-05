import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteWritingPiece } from "@/actions/writing";
import { WRITING_TYPES } from "@/lib/constants";

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
        <Link
          href="/admin/writing/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Piece
        </Link>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pieces?.map((piece) => {
              const typeLabel = WRITING_TYPES.find(
                (t) => t.value === piece.writing_type
              )?.label;
              return (
                <tr key={piece.id} className="hover:bg-muted">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {piece.title}
                    {piece.published_externally && piece.publication_name && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        in {piece.publication_name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {typeLabel || piece.writing_type}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        piece.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {piece.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {piece.published_at ? formatDate(piece.published_at) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/writing/${piece.id}/edit`}
                        className="p-1.5 text-muted-foreground/70 hover:text-muted-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteWritingPiece(piece.id);
                        }}
                      >
                        <button className="p-1.5 text-muted-foreground/70 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!pieces || pieces.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground/70">
                  No writing pieces yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
