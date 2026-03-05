"use client";

import { useState, useCallback } from "react";
import type { UploadFolder } from "@/lib/r2/utils";

interface UploadResult {
  cdnUrl: string;
  key: string;
  filename: string;
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
  result?: UploadResult;
}

export function useUpload() {
  const [uploads, setUploads] = useState<Record<string, UploadProgress>>({});
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File, folder: UploadFolder): Promise<UploadResult> => {
      const id = `${file.name}-${Date.now()}`;

      setUploads((prev) => ({
        ...prev,
        [id]: { filename: file.name, progress: 0, status: "uploading" },
      }));
      setIsUploading(true);

      try {
        // Step 1: Get presigned URL
        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            folder,
          }),
        });

        if (!presignRes.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { uploadUrl, cdnUrl, key } = await presignRes.json();

        // Step 2: Upload directly to R2 with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploads((prev) => ({
                ...prev,
                [id]: { ...prev[id], progress },
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed: ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Upload failed"));

          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        const result: UploadResult = { cdnUrl, key, filename: file.name };

        setUploads((prev) => ({
          ...prev,
          [id]: {
            filename: file.name,
            progress: 100,
            status: "complete",
            result,
          },
        }));

        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
        setUploads((prev) => ({
          ...prev,
          [id]: {
            filename: file.name,
            progress: 0,
            status: "error",
            error: message,
          },
        }));
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const clearUploads = useCallback(() => {
    setUploads({});
  }, []);

  return { uploadFile, uploads, isUploading, clearUploads };
}
