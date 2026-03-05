"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";
import type { UploadFolder } from "@/lib/r2/utils";

interface DropzoneProps {
  folder: UploadFolder;
  onUploadComplete: (result: {
    cdnUrl: string;
    key: string;
    filename: string;
  }) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  className?: string;
}

export function Dropzone({
  folder,
  onUploadComplete,
  accept = {
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    "video/*": [".mp4", ".webm", ".mov"],
  },
  maxFiles = 20,
  className,
}: DropzoneProps) {
  const { uploadFile, uploads, isUploading } = useUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        try {
          const result = await uploadFile(file, folder);
          onUploadComplete(result);
        } catch {
          // Error is tracked in uploads state
        }
      }
    },
    [uploadFile, folder, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: isUploading,
  });

  const uploadEntries = Object.entries(uploads);

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-ring bg-muted"
            : "border-border hover:border-border",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
        {isDragActive ? (
          <p className="text-primary font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="text-muted-foreground font-medium">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Images (JPG, PNG, GIF, WebP, SVG) and videos (MP4, WebM, MOV)
            </p>
          </>
        )}
      </div>

      {uploadEntries.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadEntries.map(([id, upload]) => (
            <div
              key={id}
              className="flex items-center gap-3 p-2 bg-muted rounded"
            >
              {upload.status === "complete" && (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              )}
              {upload.status === "error" && (
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              )}
              {upload.status === "uploading" && (
                <div className="h-4 w-4 shrink-0 border-2 border-ring border-t-transparent rounded-full animate-spin" />
              )}

              <span className="text-sm text-foreground/80 truncate flex-1">
                {upload.filename}
              </span>

              {upload.status === "uploading" && (
                <div className="w-24 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}

              {upload.status === "error" && (
                <span className="text-xs text-red-500">{upload.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
