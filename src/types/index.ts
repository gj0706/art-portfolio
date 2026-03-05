// ============================================================
// Database row types (matches Supabase schema)
// ============================================================

export type ArtworkMedium =
  | "pencil"
  | "pen_ink"
  | "watercolor"
  | "acrylic"
  | "oil"
  | "pastel"
  | "charcoal"
  | "digital"
  | "mixed_media"
  | "collage"
  | "sculpture"
  | "photography"
  | "animation"
  | "other";

export type ArtworkStatus = "draft" | "published" | "archived";
export type PostStatus = "draft" | "published" | "archived";
export type CommentStatus = "pending" | "approved" | "rejected" | "spam";
export type CollectionType = "age_group" | "medium" | "theme" | "series" | "achievement";
export type WritingType = "poem" | "reflection" | "essay" | "story" | "other";
export type MediaType = "image" | "video" | "gif" | "animation";

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  medium: ArtworkMedium;
  age_created: number | null;
  year_created: number | null;
  date_created: string | null;
  dimensions: string | null;
  is_featured: boolean;
  status: ArtworkStatus;
  sort_order: number;
  tags: string[];
  story: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArtworkMedia {
  id: string;
  artwork_id: string;
  media_type: MediaType;
  url: string;
  r2_key: string;
  thumbnail_url: string | null;
  blurhash: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  mime_type: string | null;
  alt_text: string | null;
  caption: string | null;
  is_primary: boolean;
  sort_order: number;
  video_embed_url: string | null;
  video_duration: number | null;
  created_at: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  collection_type: CollectionType;
  cover_image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Record<string, unknown>;
  content_html: string | null;
  cover_image_url: string | null;
  author_name: string;
  status: PostStatus;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  commentable_type: "artwork" | "blog_post" | "writing";
  commentable_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  status: CommentStatus;
  ip_address: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface WritingPiece {
  id: string;
  title: string;
  slug: string;
  writing_type: WritingType;
  content: Record<string, unknown>;
  content_html: string | null;
  excerpt: string | null;
  publication_name: string | null;
  published_externally: boolean;
  cover_image_url: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  key: string;
  value: unknown;
  updated_at: string;
}

// ============================================================
// Joined / enriched types
// ============================================================

export interface ArtworkWithMedia extends Artwork {
  artwork_media: ArtworkMedia[];
}

export interface ArtworkWithMediaAndCollections extends ArtworkWithMedia {
  artwork_collections: { collection_id: string; collections: Collection }[];
}

export interface CollectionWithArtworks extends Collection {
  artwork_collections: { artwork_id: string; artworks: ArtworkWithMedia }[];
}

export interface BlogPostWithComments extends BlogPost {
  comments: Comment[];
}
