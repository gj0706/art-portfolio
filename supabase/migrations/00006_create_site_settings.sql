CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('site_title', '"Art Portfolio"'),
  ('site_description', '"A journey through art from age 2 to today"'),
  ('artist_name', '"Artist"'),
  ('about_bio', '""'),
  ('about_inspirations', '[]'),
  ('social_links', '{}'),
  ('hero_image_url', '""'),
  ('hero_tagline', '"Drawing my world since age 2"'),
  ('contact_email', '""');

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
