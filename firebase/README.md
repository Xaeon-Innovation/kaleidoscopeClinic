# Firebase setup

This project expects Firebase **Auth (email/password)**, **Firestore**, and **Storage**.

## 1) Create a Firebase project
- Create a project in Firebase Console.
- Enable **Authentication → Email/Password**.
- Create a **Firestore** database (production mode is fine; rules are provided).
- Enable **Storage** (rules are provided).

## 2) Environment variables
- Copy `.env.local.example` to `.env.local`
- Fill values from **Project settings → Your apps → Web app**.

## 3) Security rules
Rules live in:
- `firebase/firestore.rules`
- `firebase/storage.rules`

Deploy them with Firebase CLI (once you have it installed and are logged in):

```bash
firebase deploy --only firestore:rules,storage
```

## 4) Admin access
Admin access is controlled by a Firestore document at:
- `admins/<uid>`

After you create the first admin user via Auth, add their UID as a doc in `admins`.

