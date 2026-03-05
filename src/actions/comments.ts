"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { commentSchema } from "@/lib/validations";
import { headers } from "next/headers";

export async function submitComment(formData: FormData) {
  const raw = Object.fromEntries(formData);

  // Honeypot check
  if (raw.honeypot && (raw.honeypot as string).length > 0) {
    // Bot detected — return success silently
    return { success: true };
  }

  const parsed = commentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Rate limit: check for recent comments from this IP
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0] ||
    headerStore.get("x-real-ip") ||
    "unknown";

  const adminClient = createAdminClient();

  // Check for recent comments from this IP (last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await adminClient
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", oneHourAgo);

  if (count && count >= 3) {
    return {
      error: {
        _form: ["Too many comments. Please wait before commenting again."],
      },
    };
  }

  // Check for too many URLs (spam indicator)
  const urlCount = (
    parsed.data.content.match(/https?:\/\//g) || []
  ).length;
  if (urlCount > 3) {
    return {
      error: { content: ["Comment contains too many links."] },
    };
  }

  // Insert comment as pending
  const { error } = await adminClient.from("comments").insert({
    commentable_type: parsed.data.commentable_type,
    commentable_id: parsed.data.commentable_id,
    author_name: parsed.data.author_name,
    author_email: parsed.data.author_email || null,
    content: parsed.data.content,
    status: "pending",
    ip_address: ip,
  });

  if (error) return { error: { _form: [error.message] } };

  return { success: true };
}

export async function moderateComment(
  commentId: string,
  action: "approve" | "reject" | "delete"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (action === "delete") {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (error) return { error: error.message };
  } else {
    const status = action === "approve" ? "approved" : "rejected";
    const { error } = await supabase
      .from("comments")
      .update({ status })
      .eq("id", commentId);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/comments");
  revalidatePath("/gallery");
  revalidatePath("/blog");
  revalidatePath("/writing");
  return { success: true };
}
