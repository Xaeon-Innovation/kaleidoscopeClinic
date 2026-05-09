"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password
      );
      // AdminShell will redirect if authorized.
    } catch {
      setError("Login failed. Check email/password and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Sign in with your email and password.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">Email</span>
            <input
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[var(--gold)]"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-black/70">Password</span>
            <input
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[var(--gold)]"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] hover:bg-[var(--gold-2)] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-xs text-black/55">
            If you can sign in but see “Access denied”, add your UID to{" "}
            <span className="font-mono">admins/&lt;uid&gt;</span> in Firestore.
          </p>
        </form>
      </div>
    </div>
  );
}

