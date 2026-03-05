-- Enable RLS on all tables
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PUBLIC READ POLICIES
-- ============================================================

CREATE POLICY "Public can view published artworks"
  ON artworks FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view media for published artworks"
  ON artwork_media FOR SELECT USING (
    EXISTS (SELECT 1 FROM artworks WHERE artworks.id = artwork_media.artwork_id AND artworks.status = 'published')
  );

CREATE POLICY "Public can view visible collections"
  ON collections FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Public can view artwork_collections"
  ON artwork_collections FOR SELECT USING (
    EXISTS (SELECT 1 FROM artworks WHERE artworks.id = artwork_collections.artwork_id AND artworks.status = 'published')
    AND EXISTS (SELECT 1 FROM collections WHERE collections.id = artwork_collections.collection_id AND collections.is_visible = TRUE)
  );

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Public can view approved comments"
  ON comments FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can submit comments"
  ON comments FOR INSERT WITH CHECK (status = 'pending');

CREATE POLICY "Public can view published writing"
  ON writing_pieces FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT USING (TRUE);

-- ============================================================
-- ADMIN POLICIES (any authenticated user = admin)
-- ============================================================

CREATE POLICY "Admin full access to artworks"
  ON artworks FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to artwork_media"
  ON artwork_media FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to collections"
  ON collections FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to artwork_collections"
  ON artwork_collections FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to blog_posts"
  ON blog_posts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to comments"
  ON comments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to writing_pieces"
  ON writing_pieces FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to site_settings"
  ON site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
