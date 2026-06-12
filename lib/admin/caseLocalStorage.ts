import "server-only";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "cases");

function imageExtension(contentType: string, originalName?: string) {
  const lower = originalName?.toLowerCase() ?? "";
  if (lower.endsWith(".png") || contentType === "image/png") return "png";
  if (lower.endsWith(".webp") || contentType === "image/webp") return "webp";
  return "jpg";
}

export function isLocalCaseImageUrl(url: string | undefined): boolean {
  return Boolean(url?.startsWith("/uploads/cases/"));
}

export async function uploadCaseImageLocal(
  caseId: string,
  which: "before" | "after",
  buffer: Buffer,
  contentType: string,
  originalName?: string
): Promise<string> {
  const ext = imageExtension(contentType, originalName);
  const dir = path.join(UPLOAD_ROOT, caseId);
  await mkdir(dir, { recursive: true });

  const fileName = `${which}.${ext}`;
  await writeFile(path.join(dir, fileName), buffer);

  return `/uploads/cases/${caseId}/${fileName}`;
}

export async function removeCaseImageLocal(url: string | undefined) {
  if (!isLocalCaseImageUrl(url)) return;
  const relative = url!.replace(/^\/+/, "");
  const filePath = path.join(process.cwd(), "public", relative);
  try {
    await unlink(filePath);
  } catch {
    // File may already be gone.
  }
}
