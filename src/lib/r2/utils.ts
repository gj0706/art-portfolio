import { randomUUID } from "crypto";

export type UploadFolder =
  | "artworks"
  | "blog"
  | "writing"
  | "products"
  | "misc";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function generateR2Key(folder: UploadFolder, filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "bin";
  const uniqueId = randomUUID();
  return `${folder}/${uniqueId}.${ext}`;
}

export function isAllowedContentType(contentType: string): boolean {
  return ALLOWED_TYPES.includes(contentType);
}

export function isImageType(contentType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(contentType);
}

export function isVideoType(contentType: string): boolean {
  return ALLOWED_VIDEO_TYPES.includes(contentType);
}

export function getMaxFileSize(): number {
  return MAX_FILE_SIZE;
}
