"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <aside className="w-60 bg-gray-900 text-gray-300 flex flex-col min-h-screen">
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Palette className="h-6 w-6" />
          <span className="font-semibold">Art Portfolio</span>
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
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
