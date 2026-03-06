"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoProtectionProps {
  src: string;
  poster?: string | null;
  title?: string;
  className?: string;
}

export function VideoProtection({
  src,
  poster,
  title,
  className,
}: VideoProtectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const preventContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={cn("video-protection", className)}
      onContextMenu={preventContextMenu}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        title={title}
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        playsInline
        preload="metadata"
        className="video-protection__player"
      >
        Your browser does not support the video tag.
      </video>
      <div className="image-protection__watermark" aria-hidden="true" />
    </div>
  );
}
