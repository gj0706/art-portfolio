import { ArtworkCard } from "./artwork-card";
import type { ArtworkWithMedia } from "@/types";

interface ArtworkGridProps {
  artworks: ArtworkWithMedia[];
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400 text-lg">No artworks to display yet.</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
