import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
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
      {primaryImage && primaryImage.media_type === "video" ? (
        // Video primary: show thumbnail with play icon, or placeholder
        <ImageProtection variant="thumbnail">
          {primaryImage.thumbnail_url ? (
            <div className="relative">
              <Image
                src={primaryImage.thumbnail_url}
                alt={primaryImage.alt_text || artwork.title}
                width={primaryImage.width || 0}
                height={primaryImage.height || 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                style={!primaryImage.width ? { width: "100%", height: "auto" } : undefined}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-foreground/60 flex items-center justify-center backdrop-blur-sm">
                  <Play className="h-4 w-4 text-background fill-background ml-0.5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
              <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                <Play className="h-5 w-5 text-muted-foreground fill-muted-foreground ml-0.5" />
              </div>
            </div>
          )}
        </ImageProtection>
      ) : primaryImage ? (
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
      ) : null}
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
