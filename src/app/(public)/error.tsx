"use client";

import { useEffect } from "react";

export default function PublicError({
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
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h2 className="font-serif text-2xl font-normal text-foreground mb-4">
        Something went wrong
      </h2>
      <p className="text-muted-foreground mb-8">
        We encountered an unexpected error. Please try again.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-border text-foreground/80 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
