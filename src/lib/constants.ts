export const SITE_CONFIG = {
  name: "Art Portfolio",
  description: "A journey through art from age 2 to today",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export const ARTWORK_MEDIUMS = [
  { value: "pencil", label: "Pencil" },
  { value: "pen_ink", label: "Pen & Ink" },
  { value: "watercolor", label: "Watercolor" },
  { value: "acrylic", label: "Acrylic" },
  { value: "oil", label: "Oil" },
  { value: "pastel", label: "Pastel" },
  { value: "charcoal", label: "Charcoal" },
  { value: "digital", label: "Digital" },
  { value: "mixed_media", label: "Mixed Media" },
  { value: "collage", label: "Collage" },
  { value: "sculpture", label: "Sculpture" },
  { value: "photography", label: "Photography" },
  { value: "animation", label: "Animation" },
  { value: "other", label: "Other" },
] as const;

export const COLLECTION_TYPES = [
  { value: "age_group", label: "Age Group" },
  { value: "medium", label: "Medium" },
  { value: "theme", label: "Theme" },
  { value: "series", label: "Series" },
  { value: "achievement", label: "Achievement" },
] as const;

export const WRITING_TYPES = [
  { value: "poem", label: "Poem" },
  { value: "reflection", label: "Reflection" },
  { value: "essay", label: "Essay" },
  { value: "story", label: "Story" },
  { value: "other", label: "Other" },
] as const;

export const ITEMS_PER_PAGE = 24;
