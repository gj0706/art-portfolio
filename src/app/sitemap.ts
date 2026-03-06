import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/writing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/process`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return staticPages;
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const [artworks, collections, posts, writing] = await Promise.all([
    supabase.from("artworks").select("slug, updated_at").eq("status", "published"),
    supabase.from("collections").select("slug, updated_at").eq("is_visible", true),
    supabase.from("blog_posts").select("slug, updated_at").eq("status", "published"),
    supabase.from("writing_pieces").select("slug, updated_at").eq("status", "published"),
  ]);

  const artworkPages: MetadataRoute.Sitemap =
    artworks.data?.map((a) => ({
      url: `${baseUrl}/gallery/${a.slug}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })) || [];

  const collectionPages: MetadataRoute.Sitemap =
    collections.data?.map((c) => ({
      url: `${baseUrl}/collections/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  const blogPages: MetadataRoute.Sitemap =
    posts.data?.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) || [];

  const writingPages: MetadataRoute.Sitemap =
    writing.data?.map((w) => ({
      url: `${baseUrl}/writing/${w.slug}`,
      lastModified: new Date(w.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) || [];

  return [
    ...staticPages,
    ...artworkPages,
    ...collectionPages,
    ...blogPages,
    ...writingPages,
  ];
}
