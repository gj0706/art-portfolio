import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
