"use client";

import * as React from "react";

export interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const FileUpload = ({
  label,
  error,
  helperText,
  disabled,
  accept,
  maxSize,
  multiple,
  onFilesChange,
}: FileUploadProps) => {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [sizeError, setSizeError] = React.useState<string>("");

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);

    if (maxSize) {
      const oversized = arr.filter((f) => f.size > maxSize);
      if (oversized.length > 0) {
        setSizeError(`File vượt quá dung lượng tối đa ${formatBytes(maxSize)}`);
        return;
      }
    }

    setSizeError("");
    const next = multiple ? [...files, ...arr] : arr;
    setFiles(next);
    onFilesChange?.(next);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFilesChange?.(next);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  const displayError = error || sizeError;

  return (
    <div className="flex flex-col gap-[var(--st-spacing-2)]">
      {label && (
        <label
          htmlFor={id}
          className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]"
        >
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "flex flex-col items-center justify-center gap-[var(--st-spacing-2)]",
          "rounded-[var(--st-radius-md)] border-2 border-dashed",
          "px-[var(--st-spacing-6)] py-[var(--st-spacing-8)]",
          "transition-colors cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          dragOver
            ? "border-[var(--st-color-brand-primary)] bg-[var(--st-color-brand-subtle)]"
            : displayError
              ? "border-[var(--st-color-feedback-danger)]"
              : "border-[var(--st-color-text-muted)] hover:border-[var(--st-color-brand-primary)] hover:bg-[var(--st-color-brand-subtle)]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={
            dragOver
              ? "text-[var(--st-color-brand-primary)]"
              : "text-[var(--st-color-text-muted)]"
          }
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>

        <div className="text-center">
          <p className="text-[var(--st-font-size-sm)] font-medium text-[var(--st-color-text-default)]">
            Drag & drop hoặc{" "}
            <span className="text-[var(--st-color-brand-primary)] underline">
              chọn file
            </span>
          </p>
          {(accept || maxSize) && (
            <p className="mt-[var(--st-spacing-1)] text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]">
              {[
                accept && `Chấp nhận: ${accept}`,
                maxSize && `Tối đa: ${formatBytes(maxSize)}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-[var(--st-spacing-1)]">
          {files.map((file, i) => (
            <div
              key={i}
              className={[
                "flex items-center justify-between",
                "rounded-[var(--st-radius-md)] border",
                "border-[var(--st-color-text-muted)] border-opacity-30",
                "px-[var(--st-spacing-3)] py-[var(--st-spacing-2)]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center gap-[var(--st-spacing-2)] min-w-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="flex-shrink-0 text-[var(--st-color-brand-primary)]"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div className="min-w-0">
                  <p className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-default)] truncate">
                    {file.name}
                  </p>
                  <p className="text-[var(--st-font-size-xs)] text-[var(--st-color-text-muted)]">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-[var(--st-spacing-2)] flex-shrink-0 text-[var(--st-color-text-muted)] hover:text-[var(--st-color-feedback-danger)] transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {displayError && (
        <p className="text-[var(--st-font-size-sm)] text-[var(--st-color-feedback-danger)]">
          {displayError}
        </p>
      )}
      {!displayError && helperText && (
        <p className="text-[var(--st-font-size-sm)] text-[var(--st-color-text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
};

FileUpload.displayName = "FileUpload";
