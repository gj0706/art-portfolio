import { createClient } from "@/lib/supabase/server";
import { ArtworkCard } from "@/components/gallery/artwork-card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerChildren } from "@/components/motion/stagger-children";
import { AnimatedText } from "@/components/motion/animated-text";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
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

  // Get recent blog posts
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, published_at, tags")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(3);

  const featuredArtworks = (featured as ArtworkWithMedia[]) || [];
  const recentArtworks = (recent as ArtworkWithMedia[]) || [];
  const recentPosts = blogPosts || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Hero — editorial, spacious, type-driven */}
        <section className="py-28 sm:py-40 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">
                A creative journey from age 2 to today
              </p>
            </FadeIn>

            <AnimatedText
              text="Anna's Art Adventure"
              as="h1"
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-foreground mb-6 leading-[1.15]"
              delay={0.15}
            />

            <FadeIn delay={0.35}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
                From first scribbles to detailed illustrations, animations,
                and beyond — years of artistic growth and discovery.
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="flex gap-8 justify-center items-center">
                <Link
                  href="/gallery"
                  className="text-sm tracking-wide text-foreground border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors"
                >
                  Explore Gallery
                </Link>
                <Link
                  href="/about"
                  className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  About the Artist
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Featured */}
        {featuredArtworks.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <FadeIn>
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                  Featured
                </h2>
                <Link
                  href="/gallery"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeIn>
            <StaggerChildren className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {featuredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </StaggerChildren>
          </section>
        )}

        {/* Recent */}
        {recentArtworks.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <FadeIn>
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                  Recent Works
                </h2>
                <Link
                  href="/gallery"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeIn>
            <StaggerChildren className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
              {recentArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </StaggerChildren>
          </section>
        )}

        {/* Latest from the Blog */}
        {recentPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <FadeIn>
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                  Journal
                </h2>
                <Link
                  href="/blog"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  All posts <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl overflow-hidden bg-card hover:shadow-lg hover:shadow-foreground/[0.03] transition-all duration-300"
                >
                  {post.cover_image_url ? (
                    <div className="aspect-[2/1] overflow-hidden relative">
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[2/1] bg-muted/50 flex items-center justify-center">
                      <span className="font-serif text-3xl text-muted-foreground/20">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <time className="text-xs tracking-wide uppercase text-muted-foreground/70">
                      {post.published_at ? formatDate(post.published_at) : ""}
                    </time>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors mt-1.5">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </StaggerChildren>
          </section>
        )}

        {/* CTA when empty */}
        {featuredArtworks.length === 0 && recentArtworks.length === 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
            <p className="text-muted-foreground text-lg">
              The gallery is being prepared. Check back soon.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
