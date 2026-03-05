import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteArtwork } from "@/actions/artworks";
import { ARTWORK_MEDIUMS } from "@/lib/constants";
import type { Artwork, ArtworkMedia } from "@/types";

export default async function AdminArtworksPage() {
  const supabase = await createClient();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("*, artwork_media(id, url, is_primary)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Artworks</h1>
        <Link
          href="/admin/artworks/new"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Artwork
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Artwork
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Medium
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Year
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Created
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(artworks as (Artwork & { artwork_media: ArtworkMedia[] })[] | null)?.map(
              (artwork) => {
                const primaryImage = artwork.artwork_media?.find(
                  (m) => m.is_primary
                );
                const mediumLabel = ARTWORK_MEDIUMS.find(
                  (m) => m.value === artwork.medium
                )?.label;

                return (
                  <tr key={artwork.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={artwork.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {artwork.title}
                          </p>
                          {artwork.is_featured && (
                            <span className="text-xs text-amber-600">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {mediumLabel || artwork.medium}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {artwork.year_created || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          artwork.status === "published"
                            ? "bg-green-100 text-green-700"
                            : artwork.status === "draft"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {artwork.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(artwork.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/artworks/${artwork.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteArtwork(artwork.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
            {(!artworks || artworks.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  No artworks yet. Click "Add Artwork" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
