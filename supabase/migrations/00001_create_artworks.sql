-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for artwork medium types
CREATE TYPE artwork_medium AS ENUM (
  'pencil', 'pen_ink', 'watercolor', 'acrylic', 'oil',
  'pastel', 'charcoal', 'digital', 'mixed_media', 'collage',
  'sculpture', 'photography', 'animation', 'other'
);

CREATE TYPE artwork_status AS ENUM ('draft', 'published', 'archived');

-- Main artworks table
CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  medium artwork_medium NOT NULL DEFAULT 'other',
  age_created SMALLINT,
  year_created SMALLINT,
  date_created DATE,
  dimensions TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status artwork_status DEFAULT 'draft',
  sort_order INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  story TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artwork media (multiple images/videos per artwork)
CREATE TABLE artwork_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'gif', 'animation')),
  url TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  thumbnail_url TEXT,
  blurhash TEXT,
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  mime_type TEXT,
  alt_text TEXT,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  video_embed_url TEXT,
  video_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_artworks_slug ON artworks(slug);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_artworks_medium ON artworks(medium);
CREATE INDEX idx_artworks_year ON artworks(year_created);
CREATE INDEX idx_artworks_featured ON artworks(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_artworks_tags ON artworks USING GIN(tags);
CREATE INDEX idx_artwork_media_artwork ON artwork_media(artwork_id);
CREATE INDEX idx_artwork_media_primary ON artwork_media(artwork_id) WHERE is_primary = TRUE;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
