import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Image, FileText, MessageSquare, PenTool } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getStats() {
  const supabase = await createClient();

  const [artworks, blogPosts, pendingComments, writingPieces] =
    await Promise.all([
      supabase
        .from("artworks")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("writing_pieces")
        .select("id", { count: "exact", head: true }),
    ]);

  return {
    artworks: artworks.count ?? 0,
    blogPosts: blogPosts.count ?? 0,
    pendingComments: pendingComments.count ?? 0,
    writingPieces: writingPieces.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Artworks",
      value: stats.artworks,
      icon: Image,
      href: "/admin/artworks",
    },
    {
      label: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      href: "/admin/blog",
    },
    {
      label: "Pending Comments",
      value: stats.pendingComments,
      icon: MessageSquare,
      href: "/admin/comments",
      highlight: stats.pendingComments > 0,
    },
    {
      label: "Writing Pieces",
      value: stats.writingPieces,
      icon: PenTool,
      href: "/admin/writing",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card
              className={`transition-shadow hover:shadow-md ${
                card.highlight
                  ? "border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30"
                  : ""
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <card.icon className="h-5 w-5 text-muted-foreground/70" />
                  {card.highlight && (
                    <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
