"use client";

import { type ReactNode, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImageProtectionProps {
  children: ReactNode;
  className?: string;
  /** "full" shows watermark overlay; "thumbnail" skips watermark */
  variant?: "full" | "thumbnail";
}

export function ImageProtection({
  children,
  className,
  variant = "full",
}: ImageProtectionProps) {
  const preventContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const preventDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={cn("image-protection", className)}
      onContextMenu={preventContextMenu}
      onDragStart={preventDragStart}
    >
      <div className="image-protection__content">{children}</div>
      <div className="image-protection__overlay" aria-hidden="true" />
      {variant === "full" && (
        <div className="image-protection__watermark" aria-hidden="true" />
      )}
    </div>
  );
}
