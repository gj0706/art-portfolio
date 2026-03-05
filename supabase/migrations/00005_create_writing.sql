CREATE TYPE writing_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE writing_type AS ENUM ('poem', 'reflection', 'essay', 'story', 'other');

CREATE TABLE writing_pieces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  writing_type writing_type NOT NULL DEFAULT 'reflection',
  content JSONB NOT NULL DEFAULT '{}',
  content_html TEXT,
  excerpt TEXT,
  publication_name TEXT,
  published_externally BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT,
  status writing_status DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_writing_slug ON writing_pieces(slug);
CREATE INDEX idx_writing_status ON writing_pieces(status);
CREATE INDEX idx_writing_type ON writing_pieces(writing_type);

CREATE TRIGGER writing_pieces_updated_at
  BEFORE UPDATE ON writing_pieces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
