import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-7xl font-normal text-foreground/10 mb-4">404</h1>
        <h2 className="font-serif text-xl text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          This page doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="text-sm text-foreground border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
