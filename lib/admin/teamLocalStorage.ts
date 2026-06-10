import "server-only";

import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "team");

function imageExtension(contentType: string, originalName?: string) {
  const lower = originalName?.toLowerCase() ?? "";
  if (lower.endsWith(".png") || contentType === "image/png") return "png";
  if (lower.endsWith(".webp") || contentType === "image/webp") return "webp";
  return "jpg";
}

export function isLocalTeamImageUrl(url: string | undefined): boolean {
  return Boolean(url?.startsWith("/uploads/team/"));
}

export async function uploadTeamHeadshotLocal(
  memberKey: string,
  buffer: Buffer,
  contentType: string,
  originalName?: string
): Promise<string> {
  const ext = imageExtension(contentType, originalName);
  const dir = path.join(UPLOAD_ROOT, memberKey);
  await mkdir(dir, { recursive: true });

  const fileName = `headshot.${ext}`;
  await writeFile(path.join(dir, fileName), buffer);

  return `/uploads/team/${memberKey}/${fileName}`;
}
