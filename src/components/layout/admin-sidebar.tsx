"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NextImage from "next/image";
import {
  LayoutDashboard,
  Image,
  FolderOpen,
  FileText,
  MessageSquare,
  Upload,
  PenTool,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/artworks", icon: Image, label: "Artworks" },
  { href: "/admin/collections", icon: FolderOpen, label: "Collections" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/writing", icon: PenTool, label: "Writing" },
  { href: "/admin/comments", icon: MessageSquare, label: "Comments" },
  { href: "/admin/uploads", icon: Upload, label: "Media" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-primary-foreground/20">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary-foreground"
          onClick={() => setMobileOpen(false)}
        >
          <NextImage src="/anna-logo-64.png" alt="" width={28} height={28} className="rounded-full" />
          <span className="font-semibold">Anna&apos;s Art Adventure</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary-foreground/15 text-primary-foreground font-medium"
                  : "hover:bg-primary-foreground/10 hover:text-primary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-primary-foreground/20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 h-14 px-4 bg-primary text-primary-foreground lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-primary-foreground hover:bg-primary-foreground/10"
          aria-expanded={mobileOpen}
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href="/admin" className="flex items-center gap-2 text-primary-foreground">
          <NextImage src="/anna-logo-64.png" alt="" width={24} height={24} className="rounded-full" />
          <span className="font-semibold text-sm">Admin</span>
        </Link>
      </div>

      {/* Backdrop (mobile only) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 w-60 bg-primary text-primary-foreground/70 flex flex-col h-screen transition-transform duration-200 ease-in-out",
          // Desktop: always visible
          "lg:translate-x-0",
          // Mobile: off-screen by default, slides in when open
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
