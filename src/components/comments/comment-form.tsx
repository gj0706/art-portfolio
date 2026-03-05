"use client";

import { useState } from "react";
import { submitComment } from "@/actions/comments";

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
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
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
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Not displayed publicly"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">
          Comment *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground/70 mt-1">
          {content.length}/2000 characters
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
  );
}
