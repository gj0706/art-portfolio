import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageProtection } from "@/components/ui/image-protection";
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
      aria-label={artwork.title}
      className={cn(
        "group block break-inside-avoid mb-5 rounded-xl overflow-hidden bg-card hover:shadow-lg hover:shadow-foreground/[0.03] transition-all duration-300",
        className
      )}
    >
      {primaryImage && (
        <ImageProtection variant="thumbnail">
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text || artwork.title}
            width={primaryImage.width || 0}
            height={primaryImage.height || 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            style={!primaryImage.width ? { width: "100%", height: "auto" } : undefined}
          />
        </ImageProtection>
      )}
      <div className="p-3.5">
        <h3 className="font-serif text-sm text-foreground group-hover:text-accent transition-colors">
          {artwork.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {mediumLabel && (
            <span className="text-xs text-muted-foreground">{mediumLabel}</span>
          )}
          {artwork.age_created && (
            <span className="text-xs text-muted-foreground/70">
              Age {artwork.age_created}
            </span>
          )}
          {artwork.year_created && (
            <span className="text-xs text-muted-foreground/70">{artwork.year_created}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
