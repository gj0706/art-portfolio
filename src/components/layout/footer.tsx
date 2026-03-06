import Link from "next/link";

const footerLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/collections", label: "Collections" },
  { href: "/blog", label: "Blog" },
  { href: "/writing", label: "Writing" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-lg text-foreground tracking-tight"
            >
              Anna&apos;s Art Adventure
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              A creative journey from first scribbles to detailed illustrations
              and beyond.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Follow Along
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} Anna&apos;s Art Adventure. All
            artworks are original creations and may not be reproduced without permission.
          </p>
          <p className="text-xs text-muted-foreground/50">Built with love</p>
        </div>
      </div>
    </footer>
  );
}
