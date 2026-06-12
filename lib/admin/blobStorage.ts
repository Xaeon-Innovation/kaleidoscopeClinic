import "server-only";

import { del, put } from "@vercel/blob";

function imageExtension(contentType: string, originalName?: string) {
  const lower = originalName?.toLowerCase() ?? "";
  if (lower.endsWith(".png") || contentType === "image/png") return "png";
  if (lower.endsWith(".webp") || contentType === "image/webp") return "webp";
  return "jpg";
}

export function isBlobImageUrl(url: string | undefined): boolean {
  return Boolean(url?.includes(".public.blob.vercel-storage.com"));
}

export async function uploadCaseImageBlob(
  caseId: string,
  which: "before" | "after",
  buffer: Buffer,
  contentType: string,
  originalName?: string
): Promise<string> {
  const ext = imageExtension(contentType, originalName);
  const pathname = `cases/${caseId}/${which}.${ext}`;
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: contentType || "image/jpeg",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function uploadTeamHeadshotBlob(
  memberKey: string,
  buffer: Buffer,
  contentType: string,
  originalName?: string
): Promise<string> {
  const ext = imageExtension(contentType, originalName);
  const pathname = `team/${memberKey}/headshot.${ext}`;
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: contentType || "image/jpeg",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function uploadReferralFileBlob(
  submissionId: string,
  buffer: Buffer,
  contentType: string,
  safeFileName: string
): Promise<string> {
  const pathname = `referral_uploads/${submissionId}/${Date.now()}_${safeFileName}`;
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function removeBlobByUrl(url: string | undefined) {
  if (!url || !isBlobImageUrl(url)) return;
  try {
    await del(url);
  } catch {
    // Best-effort cleanup.
  }
}
