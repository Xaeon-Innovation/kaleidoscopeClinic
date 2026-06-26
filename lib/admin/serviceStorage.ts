import "server-only";

import { randomUUID } from "crypto";
import {
  isBlobImageUrl,
  removeBlobByUrl,
  uploadServiceImageBlob,
} from "@/lib/admin/blobStorage";
import { getCaseImageStorageMode } from "@/lib/admin/caseStorage";
import { uploadServiceImageLocal } from "@/lib/admin/serviceLocalStorage";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export function resolveServiceSlugKey(serviceSlug?: string): string {
  const trimmed = serviceSlug?.trim();
  return trimmed || `drafts/${randomUUID()}`;
}

export async function uploadServiceImageAdmin(
  serviceSlug: string,
  buffer: Buffer,
  contentType: string,
  originalName?: string,
  previousUrl?: string
): Promise<string> {
  const ct = contentType || "image/jpeg";
  if (!ALLOWED.has(ct)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, or WebP.");
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be under 4MB.");
  }

  if (isBlobImageUrl(previousUrl)) {
    await removeBlobByUrl(previousUrl);
  }

  if (getCaseImageStorageMode() === "local") {
    return uploadServiceImageLocal(serviceSlug, buffer, ct, originalName);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in Vercel or use CASE_IMAGE_STORAGE=local for offline dev."
    );
  }

  return uploadServiceImageBlob(serviceSlug, buffer, ct, originalName);
}
