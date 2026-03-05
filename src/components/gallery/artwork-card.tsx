import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArtworkWithMedia } from "@/types";
import { ARTWORK_MEDIUMS } from "@/lib/constants";

interface ArtworkCardProps {
  artwork: ArtworkWithMedia;
  className?: string;
}

export function ArtworkCard({ artwork, className }: ArtworkCardProps) {
  const primaryImage =
    artwork.artwork_media?.find((m) => m.is_primary) ||
    artwork.artwork_media?.[0];
  const mediumLabel = ARTWORK_MEDIUMS.find(
    (m) => m.value === artwork.medium
  )?.label;

  return (
    <Link
      href={`/gallery/${artwork.slug}`}
      className={cn(
        "group block break-inside-avoid mb-4 rounded-xl overflow-hidden bg-white border hover:shadow-lg transition-shadow",
        className
      )}
    >
      {primaryImage && (
        <div className="overflow-hidden">
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || artwork.title}
            className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
          {artwork.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {mediumLabel && (
            <span className="text-xs text-gray-500">{mediumLabel}</span>
          )}
          {artwork.age_created && (
            <span className="text-xs text-gray-400">
              Age {artwork.age_created}
            </span>
          )}
          {artwork.year_created && (
            <span className="text-xs text-gray-400">{artwork.year_created}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
