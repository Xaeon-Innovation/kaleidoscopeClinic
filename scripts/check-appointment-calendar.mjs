/**
 * Usage: node scripts/check-appointment-calendar.mjs <stripeSessionId>
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const key = m[1].trim();
      let val = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* ignore */
  }
}

loadEnv();

const sessionId = process.argv[2];
if (!sessionId) {
  console.error("Usage: node scripts/check-appointment-calendar.mjs <sessionId>");
  process.exit(1);
}

const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!saPath) {
  console.error("FIREBASE_SERVICE_ACCOUNT_PATH not set");
  process.exit(1);
}

const sa = JSON.parse(readFileSync(join(root, saPath), "utf8"));
if (!getApps().length) {
  initializeApp({ credential: cert(sa) });
}
const db = getFirestore();

const snap = await db.collection("appointments").doc(sessionId).get();
if (!snap.exists) {
  console.log("No appointment doc for", sessionId);
  process.exit(0);
}
const data = snap.data();
console.log("Firestore appointment:", JSON.stringify(data, null, 2));

const integ = await db.collection("integrations").doc("googleCalendar").get();
if (!integ.exists) {
  console.log("Google Calendar not connected");
  process.exit(0);
}
const { refreshToken, accessToken, expiryDate, calendarId, connectedEmail } =
  integ.data();

const oauth2 = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET
);
oauth2.setCredentials({
  refresh_token: refreshToken,
  access_token: accessToken,
  expiry_date: expiryDate,
});
const cal = google.calendar({ version: "v3", auth: oauth2 });

console.log("\nConnected:", connectedEmail, "calendarId:", calendarId);

if (data.calendarEventId) {
  try {
    const ev = await cal.events.get({
      calendarId: calendarId || "primary",
      eventId: data.calendarEventId,
    });
    console.log("\nGoogle event:");
    console.log("  summary:", ev.data.summary);
    console.log("  start:", ev.data.start);
    console.log("  end:", ev.data.end);
    console.log("  htmlLink:", ev.data.htmlLink);
    console.log("  description:", (ev.data.description || "").slice(0, 200));
  } catch (e) {
    console.error("\nCould not fetch event:", e.message);
  }
}
