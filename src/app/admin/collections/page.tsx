import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteCollection } from "@/actions/collections";
import { COLLECTION_TYPES } from "@/lib/constants";

export default async function AdminCollectionsPage() {
  const supabase = await createClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*, artwork_collections(artwork_id)")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Collection
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Collection</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Artworks</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Visible</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Created</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {collections?.map((collection) => {
              const typeLabel = COLLECTION_TYPES.find(
                (t) => t.value === collection.collection_type
              )?.label;
              return (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {collection.cover_image_url ? (
                        <img
                          src={collection.cover_image_url}
                          alt={collection.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200" />
                      )}
                      <span className="font-medium text-gray-900">
                        {collection.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{typeLabel}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {collection.artwork_collections?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        collection.is_visible
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {collection.is_visible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(collection.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/collections/${collection.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCollection(collection.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!collections || collections.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  No collections yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
