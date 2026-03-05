export function Footer() {
  return (
    <footer className="border-t bg-muted mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-center text-sm text-muted-foreground/70">
          &copy; {new Date().getFullYear()} Anna&apos;s Art Portfolio. All artworks are
          original creations.
        </p>
      </div>
    </footer>
  );
}
