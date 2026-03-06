import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { deleteBlogPost } from "@/actions/blog-posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-4">Title</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4">Published</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="px-4 py-3 font-medium text-foreground">
                  {post.title}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                    className={
                      post.status === "published"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : undefined
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {post.published_at ? formatDate(post.published_at) : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <form
                      action={async () => {
                        "use server";
                        await deleteBlogPost(post.id);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!posts || posts.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="px-4 py-12 text-center text-muted-foreground/70">
                  No blog posts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
