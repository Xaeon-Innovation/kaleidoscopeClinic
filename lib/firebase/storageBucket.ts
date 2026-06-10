import "server-only";

/**
 * Resolves the Firebase Storage bucket name for server-side uploads.
 * Treats empty env strings as unset (common misconfiguration).
 */
export function resolveFirebaseStorageBucket(projectId?: string): string {
  const fromEnv = [
    process.env.FIREBASE_STORAGE_BUCKET,
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  ]
    .map((v) => v?.trim())
    .find(Boolean);

  if (fromEnv) return fromEnv;

  const pid = projectId?.trim();
  if (pid) {
    // Newer Firebase projects use .firebasestorage.app; older ones use .appspot.com
    return `${pid}.firebasestorage.app`;
  }

  throw new Error(
    "Firebase Storage bucket not configured. Set FIREBASE_STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local (e.g. kaleidoscope-clinic.firebasestorage.app)."
  );
}
