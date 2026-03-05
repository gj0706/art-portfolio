CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected', 'spam');

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commentable_type TEXT NOT NULL CHECK (commentable_type IN ('artwork', 'blog_post', 'writing')),
  commentable_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL CHECK (char_length(content) <= 2000),
  status comment_status DEFAULT 'pending',
  ip_address INET,
  user_agent TEXT,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_target ON comments(commentable_type, commentable_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_approved ON comments(commentable_type, commentable_id, created_at)
  WHERE status = 'approved';
CREATE INDEX idx_comments_pending ON comments(created_at DESC)
  WHERE status = 'pending';
