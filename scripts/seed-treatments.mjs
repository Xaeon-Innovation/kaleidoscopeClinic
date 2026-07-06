/**
 * Seed Firestore "services" with the built-in treatments from lib/treatments.ts.
 *
 * Usage:
 *   node scripts/seed-treatments.mjs
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON.
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const flagshipSlug = "full-arch-implants";

const treatmentImages = {
  "full-arch-implants": "/images/fullArch.jpeg",
  "dental-implants": "/images/treatments/Dental Implants.jpg",
  "smile-makeovers": "/images/treatments/smile makeover.jpg",
  "full-mouth-rehabilitation": "/images/treatments/Full Mouth Rehabilitation.jpg",
  "facial-aesthetics": "/images/faceAesthetics.jpeg",
  "hygiene-preventive-care": "/images/treatments/hygeine.jpg",
};

const treatments = [
  {
    slug: "full-arch-implants",
    name: "Full Arch Implants",
    subtitle:
      "Same-day teeth and all-on-X solutions for missing or failing dentition.",
    category: "implants",
    bullets: [
      "Stable, natural-looking teeth for advanced tooth loss.",
      "Digitally planned with precision-led delivery.",
      "Built for long-term function and confidence.",
    ],
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    subtitle:
      "Single and multiple implants to restore bite stability and natural aesthetics.",
    category: "implants",
    bullets: [
      "Replaces missing teeth with natural-looking results.",
      "Preserves oral function and overall bite balance.",
      "Planned for longevity and day-to-day comfort.",
    ],
  },
  {
    slug: "smile-makeovers",
    name: "Smile Makeovers (Veneers)",
    subtitle:
      "Veneer-led smile design centred around refined, facially balanced outcomes.",
    category: "aesthetic",
    bullets: [
      "Natural results that avoid an overdone appearance.",
      "Designed around facial harmony and proportion.",
      "Delivered through a calm, specialist-led process.",
    ],
  },
  {
    slug: "full-mouth-rehabilitation",
    name: "Full Mouth Rehabilitation",
    subtitle:
      "Comprehensive restorative planning for worn, compromised, or unstable bites.",
    category: "restorative",
    bullets: [
      "Complex planning for compromised dentition and function.",
      "Function-first dentistry with premium aesthetics.",
      "Structured pathway toward long-term stability.",
    ],
  },
  {
    slug: "facial-aesthetics",
    name: "Facial Aesthetics",
    subtitle:
      "Clinically led facial harmony treatments with subtle, balanced enhancement.",
    category: "aesthetic",
    bullets: [
      "Subtle enhancements tailored to facial balance.",
      "Clinically led planning and conservative execution.",
      "Natural outcomes with careful consideration.",
    ],
  },
  {
    slug: "hygiene-preventive-care",
    name: "Hygiene & Preventive Care",
    subtitle:
      "Comfort-focused maintenance and hygiene support that protect long-term results.",
    category: "preventive",
    bullets: [
      "Maintain implant and restorative outcomes over time.",
      "Professional hygiene guidance and support.",
      "Patient-first care with comfort in mind.",
    ],
  },
];

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
  initAdmin();
  const db = getFirestore();
  const snap = await db.collection("services").get();
  const existing = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const existingSlugs = new Set(existing.map((doc) => String(doc.slug ?? "")));

  const desired = treatments.map((treatment, index) => ({
    name: treatment.name,
    slug: treatment.slug,
    subtitle: treatment.subtitle,
    shortBenefits: treatment.bullets,
    category: treatment.category,
    imageUrl: treatmentImages[treatment.slug],
    priority: (index + 1) * 10,
    heroFlag: treatment.slug === flagshipSlug,
    flagship: treatment.slug === flagshipSlug,
    published: true,
  }));

  const toCreate = desired.filter((doc) => !existingSlugs.has(doc.slug));

  const staleImageUrls = new Set([
    "/images/full-arch-implant.png",
    "/images/full arch.jpeg",
    "/images/full-arch.jpeg",
  ]);
  const toUpdate = existing.filter((doc) => {
    const desiredDoc = desired.find((d) => d.slug === doc.slug);
    if (!desiredDoc?.imageUrl) return false;
    const current = String(doc.imageUrl ?? "").trim();
    return staleImageUrls.has(current) || current !== desiredDoc.imageUrl;
  });

  if (toCreate.length === 0 && toUpdate.length === 0) {
    console.log(`Nothing to add — ${snap.size} treatment(s) already in Firestore.`);
    return;
  }

  const batch = db.batch();
  for (const doc of toCreate) {
    batch.set(db.collection("services").doc(), doc);
  }
  for (const doc of toUpdate) {
    const desiredDoc = desired.find((d) => d.slug === doc.slug);
    if (!desiredDoc?.imageUrl) continue;
    batch.update(db.collection("services").doc(doc.id), {
      imageUrl: desiredDoc.imageUrl,
    });
  }
  await batch.commit();

  if (toCreate.length > 0) {
    console.log(`Added ${toCreate.length} treatment(s).`);
    for (const doc of toCreate) {
      console.log(`  + ${doc.name} (/${doc.slug})`);
    }
  }
  if (toUpdate.length > 0) {
    console.log(`Updated ${toUpdate.length} treatment image URL(s).`);
    for (const doc of toUpdate) {
      const desiredDoc = desired.find((d) => d.slug === doc.slug);
      console.log(`  ~ ${doc.slug}: ${desiredDoc?.imageUrl}`);
    }
  }
  console.log(`Total services: ${snap.size + toCreate.length}.`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
