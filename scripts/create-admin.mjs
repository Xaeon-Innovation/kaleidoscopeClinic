/**
 * Create a Firebase Auth user and grant admin access in Firestore.
 *
 * Usage:
 *   node scripts/create-admin.mjs <email> <password>
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_PATH or default JSON in project root.
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) return JSON.parse(inline);

  const filePath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim() ??
    "kaleidoscope-clinic-firebase-adminsdk-fbsvc-cf5e0455fa.json";
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.join(root, filePath);
  if (!existsSync(resolved)) {
    throw new Error(`Service account file not found: ${resolved}`);
  }
  return JSON.parse(readFileSync(resolved, "utf8"));
}

function initAdmin() {
  if (getApps().length > 0) return getApps()[0];
  const sa = loadServiceAccount();
  return initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

async function main() {
  const email = process.argv[2]?.trim();
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage: node scripts/create-admin.mjs <email> <password>");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  initAdmin();
  const auth = getAuth();
  const db = getFirestore();

  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`Auth user already exists (uid: ${user.uid}). Updating password…`);
    await auth.updateUser(user.uid, { password, emailVerified: true });
  } catch (e) {
    if (e?.code !== "auth/user-not-found") throw e;
    user = await auth.createUser({
      email,
      password,
      emailVerified: true,
    });
    console.log(`Created Auth user (uid: ${user.uid}).`);
  }

  await db.collection("admins").doc(user.uid).set(
    {
      email,
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log(`Granted admin access: admins/${user.uid}`);
  console.log("You can sign in at /admin/login");
}

main().catch((err) => {
  console.error(err.message ?? err);
  if (String(err.message).includes("EMAIL_EXISTS")) {
    console.error("User exists — re-run; script will update password and admin doc.");
  }
  if (String(err.message).includes("identitytoolkit")) {
    console.error(
      "Enable Email/Password in Firebase Console → Authentication → Sign-in method."
    );
  }
  process.exit(1);
});
