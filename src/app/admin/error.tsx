"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-3">
          Admin Error
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Something went wrong loading this page. Try refreshing or go back to
          the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/admin"
            className="px-4 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-muted transition-colors"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
