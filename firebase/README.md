# Firebase setup

This project uses Firebase **Auth (email/password)** and **Firestore**. Image uploads use **Vercel Blob** instead of Firebase Storage (no Blaze plan required). See [docs/vercel.md](../docs/vercel.md) for deployment.

## 1) Create a Firebase project
- Create a project in Firebase Console.
- Enable **Authentication → Email/Password**.
- Create a **Firestore** database (production mode is fine; rules are provided).
- If you see `PERMISSION_DENIED: Cloud Firestore API has not been used`, enable the API:
  1. [Enable Cloud Firestore API](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=kaleidoscope-clinic) for your project
  2. In Firebase Console → Firestore, click **Create database** if you have not already
  3. Wait a few minutes, then restart the dev server

Firebase Storage is **optional** and not used by this app for uploads.

## 2) Environment variables
- Copy [`.env.example`](../.env.example) to `.env.local`
- Fill Firebase values from **Project settings → Your apps → Web app**.
- For server-side Firebase Admin locally, set **`FIREBASE_SERVICE_ACCOUNT_PATH`** to your downloaded service account JSON file in the project root.
- On Vercel, use **`FIREBASE_SERVICE_ACCOUNT_JSON`** instead (full JSON string).
- For image uploads: set **`CASE_IMAGE_STORAGE=local`** in `.env.local` to save under `public/uploads/` without Vercel Blob, or **`blob`** with **`BLOB_READ_WRITE_TOKEN`** from a Vercel Blob store.

## 3) Security rules
Firestore rules live in `firebase/firestore.rules`.

Deploy them with the Firebase CLI (included in this repo as a dev dependency):

```bash
npm install
npx firebase login
npm run firebase:rules
```

`firebase/storage.rules` is kept for reference if you enable Firebase Storage later; it is not required for current uploads.

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
