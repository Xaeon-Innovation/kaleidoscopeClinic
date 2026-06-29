# Deploying to Vercel

This app uses **Vercel Blob** for admin and referral image uploads. Firebase Storage is **not** required (no Blaze plan needed).

## 1. Connect the repository

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the repository.
3. Framework preset: **Next.js** (defaults: `npm run build`, output `.next`).

## 2. Create a Blob store

1. In your Vercel project: **Storage → Create Database → Blob**.
2. Vercel automatically adds `BLOB_READ_WRITE_TOKEN` to your environment variables.

## 3. Environment variables

Copy variables from [`.env.example`](../.env.example) into **Vercel → Settings → Environment Variables**.

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_FIREBASE_*` (6) | Yes | Firebase Console → Project settings → Web app |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Yes | Full service account JSON (not a file path) |
| `BLOB_READ_WRITE_TOKEN` | Yes | Auto-set when Blob store is linked |
| `CASE_IMAGE_STORAGE` | Yes | Set to `blob` |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://<project>.vercel.app` after first deploy |
| `STRIPE_SECRET_KEY` | If booking | Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | If booking | From Stripe webhook endpoint |
| `GOOGLE_OAUTH_CLIENT_ID` | If calendar | Google Cloud Console |
| `GOOGLE_OAUTH_CLIENT_SECRET` | If calendar | Google Cloud Console |
| `RESEND_API_KEY` | For emails | Contact, booking, and newsletter notifications |
| `RESEND_FROM_EMAIL` | If using Resend | Sender address (default `hello@kaleidoscopedental.co.uk`) |
| `CONTACT_EMAIL` | If using Resend | Clinic inbox for notifications (default `hello@kaleidoscopedental.co.uk`) |

**Local dev:** copy `.env.example` to `.env.local`. Use `CASE_IMAGE_STORAGE=local` to save uploads under `public/uploads/` without a Blob token.

## 4. Deploy

1. Trigger a deploy (or push to the connected branch).
2. Copy your `https://<name>.vercel.app` URL.
3. Set `NEXT_PUBLIC_APP_URL` to that URL and redeploy.

## 5. Firebase (Firestore rules only)

Deploy Firestore security rules from your machine:

```bash
npm install
npx firebase login
npm run firebase:rules
```

Firebase Storage rules are optional — this project does not use Firebase Storage.

## 6. Create the first admin

Run locally (needs service account file or `FIREBASE_SERVICE_ACCOUNT_JSON`):

```bash
npm run create-admin -- admin@example.com "your-secure-password"
```

## 7. Post-deploy integrations

| Service | URL to register |
|---------|-----------------|
| Stripe webhook | `https://<domain>/api/stripe/webhook` |
| Google OAuth redirect | `https://<domain>/api/admin/google/callback` |

Add the production redirect URI in [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.

## 8. Smoke test

- Sign in at `/admin/login`
- Upload a team headshot and a before/after case image
- Submit a referral with a small image attachment at `/referral`
- Confirm image URLs point to `*.public.blob.vercel-storage.com`
