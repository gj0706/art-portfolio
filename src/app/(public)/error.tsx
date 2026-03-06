"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <Button onClick={reset}>
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
