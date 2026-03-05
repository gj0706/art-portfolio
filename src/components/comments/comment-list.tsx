import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentListProps {
  commentableType: "artwork" | "blog_post" | "writing";
  commentableId: string;
}

export async function CommentList({
  commentableType,
  commentableId,
}: CommentListProps) {
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("commentable_type", commentableType)
    .eq("commentable_id", commentableId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No comments yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {(comments as Comment[]).map((comment) => (
        <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">
              {comment.author_name}
            </span>
            <span className="text-xs text-gray-400">
              {formatRelativeDate(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}
