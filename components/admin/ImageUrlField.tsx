"use client";

import { useEffect, useRef, useState } from "react";
import { uploadTeamHeadshot } from "@/lib/admin/uploadAdminImage";

type ImageUrlFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  memberId?: string;
  disabled?: boolean;
  placeholder?: string;
  aspectClass?: string;
  /** When true, pasted links are saved on blur instead of every keystroke. */
  deferUrlCommit?: boolean;
};

export function ImageUrlField({
  label = "Headshot",
  value,
  onChange,
  memberId,
  disabled = false,
  placeholder = "/images/dr-sherif-elsharkawy.png",
  aspectClass = "aspect-[3/4]",
  deferUrlCommit = false,
}: ImageUrlFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputKey, setInputKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState(value);

  useEffect(() => {
    setUrlDraft(value);
  }, [value]);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadTeamHeadshot(file, memberId);
      onChange(url);
      setInputKey((k) => k + 1);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const busy = disabled || uploading;

  return (
    <div className="grid gap-2 md:col-span-2">
      <span className="text-xs font-semibold text-black/70">{label}</span>

      <div className="overflow-hidden rounded-2xl bg-black/[0.03] ring-1 ring-black/10">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Preview"
            className={`${aspectClass} w-full max-w-xs object-cover object-top`}
          />
        ) : (
          <div
            className={`flex ${aspectClass} max-w-xs items-center justify-center text-xs text-black/45`}
          >
            No image yet
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          key={inputKey}
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          aria-label={`Upload ${label.toLowerCase()}`}
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-black/80 ring-1 ring-black/10 hover:bg-black/[0.03] disabled:opacity-60"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value ? (
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
            onClick={() => onChange("")}
            disabled={busy}
          >
            Remove
          </button>
        ) : null}
      </div>

      <label className="grid gap-1">
        <span className="text-xs text-black/55">Or paste an image link</span>
        <input
          className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[var(--gold)] disabled:opacity-60"
          value={deferUrlCommit ? urlDraft : value}
          onChange={(e) => {
            const next = e.target.value;
            if (deferUrlCommit) {
              setUrlDraft(next);
              return;
            }
            onChange(next);
          }}
          onBlur={() => {
            if (deferUrlCommit && urlDraft !== value) onChange(urlDraft);
          }}
          placeholder={placeholder}
          disabled={busy}
        />
      </label>

      {uploadError ? (
        <p className="text-sm text-red-700">{uploadError}</p>
      ) : null}
    </div>
  );
}
