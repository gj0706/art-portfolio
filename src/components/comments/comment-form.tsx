"use client";

import { useState } from "react";
import { submitComment } from "@/actions/comments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  commentableType: "artwork" | "blog_post" | "writing";
  commentableId: string;
}

export function CommentForm({
  commentableType,
  commentableId,
}: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.set("commentable_type", commentableType);
    formData.set("commentable_id", commentableId);
    formData.set("author_name", name);
    formData.set("author_email", email);
    formData.set("content", content);
    formData.set("honeypot", ""); // Honeypot - should stay empty

    const result = await submitComment(formData);

    if (result.error) {
      const errors = result.error as Record<string, string[]>;
      setError(
        errors._form?.[0] ||
          Object.values(errors).flat()[0] ||
          "Failed to submit comment"
      );
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-700 dark:text-green-400">
        Thank you for your comment! It will appear after approval.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Leave a Comment</h3>

      {/* Honeypot - hidden from users */}
      <input
        type="text"
        name="honeypot"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label>Email (optional)</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Not displayed publicly"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Comment *</Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={2000}
          rows={4}
        />
        <p className="text-xs text-muted-foreground/70 mt-1">
          {content.length}/2000 characters
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-red-50 dark:bg-red-950/30 p-2 rounded">{error}</p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Comment"}
      </Button>
    </form>
  );
}
