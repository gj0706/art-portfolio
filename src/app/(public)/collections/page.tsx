import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { COLLECTION_TYPES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections | Art Portfolio",
  description: "Browse curated collections of artwork organized by theme, age, and medium.",
};

export default async function CollectionsPage() {
  const supabase = await createClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*, artwork_collections(artwork_id)")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Collections</h1>
        <p className="text-gray-500">
          Curated groups of artwork organized by theme, age, and medium.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections?.map((collection) => {
          const typeLabel = COLLECTION_TYPES.find(
            (t) => t.value === collection.collection_type
          )?.label;
          const artworkCount = collection.artwork_collections?.length || 0;

          return (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group block rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow"
            >
              {collection.cover_image_url ? (
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={collection.cover_image_url}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-300">
                    {collection.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {collection.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  {typeLabel && <span>{typeLabel}</span>}
                  <span>&middot;</span>
                  <span>
                    {artworkCount} artwork{artworkCount !== 1 ? "s" : ""}
                  </span>
                </div>
                {collection.description && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {(!collections || collections.length === 0) && (
        <p className="text-center text-gray-400 py-20">
          No collections yet.
        </p>
      )}
    </div>
  );
}
