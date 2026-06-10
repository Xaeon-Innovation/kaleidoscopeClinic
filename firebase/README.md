# Firebase setup

This project expects Firebase **Auth (email/password)**, **Firestore**, and **Storage**.

## 1) Create a Firebase project
- Create a project in Firebase Console.
- Enable **Authentication → Email/Password**.
- Create a **Firestore** database (production mode is fine; rules are provided).
- If you see `PERMISSION_DENIED: Cloud Firestore API has not been used`, enable the API:
  1. [Enable Cloud Firestore API](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=kaleidoscope-clinic) for project `kaleidoscope-clinic`
  2. In [Firebase Console → Firestore](https://console.firebase.google.com/project/kaleidoscope-clinic/firestore), click **Create database** if you have not already
  3. Wait a few minutes, then restart the dev server
- Enable **Storage** (rules are provided). In Console: **Storage → Get started** — this creates your bucket (requires Blaze billing). Until Storage is enabled, local dev can use `CASE_IMAGE_STORAGE=local` in `.env.local` to save uploads under `public/uploads/`.

## 2) Environment variables
- Copy `.env.local.example` to `.env.local`
- Fill values from **Project settings → Your apps → Web app**.
- Set **`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`** to your Storage bucket (Firebase Console → Storage → bucket URL). For this project it is typically `kaleidoscope-clinic.firebasestorage.app` (newer projects) or `kaleidoscope-clinic.appspot.com` (older).
- For server-side Firebase Admin, set **`FIREBASE_SERVICE_ACCOUNT_PATH`** to your downloaded service account JSON file (e.g. `kaleidoscope-clinic-firebase-adminsdk-fbsvc-cf5e0455fa.json` in the project root). You do not need to paste the whole JSON into `.env.local`.
- Optional: set **`FIREBASE_STORAGE_BUCKET`** if server uploads should use a different bucket than the public client config.

## 3) Security rules
Rules live in:
- `firebase/firestore.rules`
- `firebase/storage.rules`

Deploy them with the Firebase CLI (included in this repo as a dev dependency):

```bash
npm install
npx firebase login
npm run firebase:rules
```

Or deploy rules and storage together:

```bash
npx firebase deploy --only firestore:rules,storage
```

## 4) Admin access
Admin access is controlled by a Firestore document at:
- `admins/<uid>`

Create the first admin (Firebase Auth + `admins/{uid}` document):

```bash
npm run create-admin -- info@kaleidoscopedental.com "your-secure-password"
```

Requires **Authentication → Sign-in method → Email/Password** enabled in Firebase Console.

## 5) Google Calendar booking

Online booking uses the clinician’s **personal Google Calendar** (OAuth), not manual slots in Firestore.

1. In [Google Cloud Console](https://console.cloud.google.com/), enable **Google Calendar API**.
2. Create an **OAuth 2.0 Web client** with authorized redirect URI:
   - `https://<your-domain>/api/admin/google/callback`
   - `http://localhost:3000/api/admin/google/callback` (local dev)
3. Set `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` in `.env.local`.
4. Sign in to `/admin` → **Settings** → **Connect Google Calendar**.
5. Manage availability:
   - Block time on Google Calendar (meetings, leave) — those slots are hidden from `/book`.
   - Adjust default hours via env: `BOOKING_OPEN_HOUR`, `BOOKING_CLOSE_HOUR`, `BOOKING_SLOT_MINUTES`, `BOOKING_WEEKDAYS`, `BOOKING_TIMEZONE`.

Deploy updated Firestore rules (includes server-only `integrations` collection):

```bash
firebase deploy --only firestore:rules
```

