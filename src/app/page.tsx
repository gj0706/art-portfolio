import { createClient } from "@/lib/supabase/server";
import { ArtworkCard } from "@/components/gallery/artwork-card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight, Palette } from "lucide-react";
import type { ArtworkWithMedia } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  // Get featured artworks
  const { data: featured } = await supabase
    .from("artworks")
    .select("*, artwork_media(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  // Get recent artworks
  const { data: recent } = await supabase
    .from("artworks")
    .select("*, artwork_media(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(8);

  const featuredArtworks = (featured as ArtworkWithMedia[]) || [];
  const recentArtworks = (recent as ArtworkWithMedia[]) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-secondary/20 to-white py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border mb-6">
              <Palette className="h-4 w-4 text-secondary" />
              <span className="text-sm text-muted-foreground">
                Drawing my world since age 2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Anna&apos;s Art Portfolio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A creative journey from first scribbles to detailed illustrations,
              animations, and beyond. Explore years of artistic growth and
              discovery.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/gallery"
                className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Gallery
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border border-border text-foreground/80 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
              >
                About the Artist
              </Link>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featuredArtworks.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Featured</h2>
              <Link
                href="/gallery"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {featuredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          </section>
        )}

        {/* Recent */}
        {recentArtworks.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Recent Works
              </h2>
              <Link
                href="/gallery"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {recentArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          </section>
        )}

        {/* CTA when empty */}
        {featuredArtworks.length === 0 && recentArtworks.length === 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
            <p className="text-muted-foreground/70 text-lg mb-4">
              The gallery is being prepared. Check back soon!
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
