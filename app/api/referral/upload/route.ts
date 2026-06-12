import { NextResponse } from "next/server";
import { uploadReferralFileBlob } from "@/lib/admin/blobStorage";
import { getCaseImageStorageMode } from "@/lib/admin/caseStorage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

export async function POST(request: Request) {
  if (getCaseImageStorageMode() === "local") {
    return NextResponse.json(
      {
        error:
          "Referral file uploads require CASE_IMAGE_STORAGE=blob and BLOB_READ_WRITE_TOKEN.",
      },
      { status: 503 }
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return NextResponse.json(
      { error: "File uploads are not configured." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const submissionId = form.get("submissionId");
  const file = form.get("file");
  if (typeof submissionId !== "string" || !submissionId.trim()) {
    return NextResponse.json({ error: "Missing submissionId." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Each file must be under 4MB." },
      { status: 400 }
    );
  }

  const ct = file.type || "application/octet-stream";
  if (!ALLOWED.has(ct)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PDF or image." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadReferralFileBlob(
      submissionId.trim(),
      buffer,
      ct,
      safeName(file.name)
    );
    return NextResponse.json({ url });
  } catch (e) {
    console.error("referral upload POST", e);
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
