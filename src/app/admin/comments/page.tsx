import { createClient } from "@/lib/supabase/server";
import { moderateComment } from "@/actions/comments";
import { formatRelativeDate } from "@/lib/utils";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = comments?.filter((c) => c.status === "pending") || [];
  const approved = comments?.filter((c) => c.status === "approved") || [];
  const rejected = comments?.filter((c) => c.status === "rejected") || [];

  function CommentCard({
    comment,
    showActions = true,
  }: {
    comment: (typeof comments extends (infer T)[] | null ? T : never);
    showActions?: boolean;
  }) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground text-sm">
                  {comment.author_name}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  {formatRelativeDate(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                on {comment.commentable_type} {comment.commentable_id.slice(0, 8)}...
              </p>
            </div>
            {showActions && (
              <div className="flex gap-1 shrink-0">
                {comment.status !== "approved" && (
                  <form
                    action={async () => {
                      "use server";
                      await moderateComment(comment.id, "approve");
                    }}
                  >
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground/70 hover:text-green-600"
                      title="Approve"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </form>
                )}
                {comment.status !== "rejected" && (
                  <form
                    action={async () => {
                      "use server";
                      await moderateComment(comment.id, "reject");
                    }}
                  >
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground/70 hover:text-orange-600"
                      title="Reject"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </form>
                )}
                <form
                  action={async () => {
                    "use server";
                    await moderateComment(comment.id, "delete");
                  }}
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground/70 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Comments
        {pending.length > 0 && (
          <Badge className="ml-2 bg-orange-500 text-white hover:bg-orange-500 align-middle">
            {pending.length} pending
          </Badge>
        )}
      </h1>

      {/* Pending */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Pending ({pending.length})
        </h2>
        <div className="space-y-3">
          {pending.length === 0 && (
            <p className="text-sm text-muted-foreground/70">No pending comments.</p>
          )}
          {pending.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>
      </section>

      {/* Approved */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Approved ({approved.length})
        </h2>
        <div className="space-y-3">
          {approved.length === 0 && (
            <p className="text-sm text-muted-foreground/70">No approved comments.</p>
          )}
          {approved.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>
      </section>

      {/* Rejected */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Rejected ({rejected.length})
        </h2>
        <div className="space-y-3">
          {rejected.length === 0 && (
            <p className="text-sm text-muted-foreground/70">No rejected comments.</p>
          )}
          {rejected.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
