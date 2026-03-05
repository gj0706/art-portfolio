CREATE TYPE collection_type AS ENUM ('age_group', 'medium', 'theme', 'series', 'achievement');

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  collection_type collection_type NOT NULL DEFAULT 'theme',
  cover_image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many junction table
CREATE TABLE artwork_collections (
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (artwork_id, collection_id)
);

CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_type ON collections(collection_type);
CREATE INDEX idx_ac_artwork ON artwork_collections(artwork_id);
CREATE INDEX idx_ac_collection ON artwork_collections(collection_id);

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
