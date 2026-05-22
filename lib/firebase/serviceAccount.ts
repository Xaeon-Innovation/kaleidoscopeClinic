import "server-only";

import { readFileSync } from "fs";
import path from "path";

export type ServiceAccountFields = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function parseRawJson(raw: string): ServiceAccountFields | null {
  try {
    const parsed = JSON.parse(raw) as ServiceAccountFields;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function readServiceAccountFile(filePath: string): ServiceAccountFields | null {
  try {
    const resolved = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    const raw = readFileSync(resolved, "utf8");
    return parseRawJson(raw);
  } catch {
    return null;
  }
}

/**
 * Firebase Admin credentials from env JSON or a JSON file path.
 */
export function loadServiceAccount(): ServiceAccountFields | null {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    const parsed = parseRawJson(inline);
    if (parsed) return parsed;
  }

  const filePath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim() ??
    "kaleidoscope-clinic-firebase-adminsdk-fbsvc-cf5e0455fa.json";

  return readServiceAccountFile(filePath);
}
