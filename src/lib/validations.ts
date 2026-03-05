import { z } from "zod";

export const artworkSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  medium: z.string().min(1, "Medium is required"),
  age_created: z.coerce.number().int().min(0).max(25).optional(),
  year_created: z.coerce.number().int().min(2000).max(2040).optional(),
  date_created: z.string().optional(),
  dimensions: z.string().max(100).optional(),
  tags: z.array(z.string()).default([]),
  story: z.string().max(10000).optional(),
  is_featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const collectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  collection_type: z.string().min(1, "Type is required"),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.any(), // TipTap JSON
  content_html: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().optional(),
});

export const commentSchema = z.object({
  commentable_type: z.enum(["artwork", "blog_post", "writing"]),
  commentable_id: z.string().uuid(),
  author_name: z.string().min(1, "Name is required").max(100),
  author_email: z.string().email().optional().or(z.literal("")),
  content: z
    .string()
    .min(1, "Comment is required")
    .max(2000, "Comment must be under 2000 characters"),
  honeypot: z.string().max(0).optional(), // Must be empty
});

export const writingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200),
  writing_type: z.string().min(1, "Type is required"),
  content: z.any(), // TipTap JSON
  content_html: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  publication_name: z.string().max(200).optional(),
  published_externally: z.boolean().default(false),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().optional(),
});

export const uploadPresignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.enum(["artworks", "blog", "writing", "products", "misc"]),
});
