import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ALLOWED_HOSTS = [
  "annasartadventure.com",
  "www.annasartadventure.com",
  "localhost",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Hotlink protection for optimized images ---
  if (pathname.startsWith("/_next/image")) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        const host = new URL(referer).hostname;
        const isAllowed = ALLOWED_HOSTS.some(
          (h) => host === h || host.endsWith(`.${h}`)
        );
        if (!isAllowed) {
          return new NextResponse("Forbidden", { status: 403 });
        }
      } catch {
        // Invalid referer URL — allow through
      }
    }
  }

  // --- Supabase session refresh for admin routes ---
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth/callback")
  ) {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/_next/image",
    "/admin/:path*",
    "/auth/callback",
  ],
};
