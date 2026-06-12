"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password
      );
      // Mint a server-readable session cookie so middleware can protect /admin
      const idToken = await cred.user.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const from = searchParams.get("from") ?? "/admin";
      router.replace(from);
    } catch {
      setError("Login failed. Check email/password and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-dark)] px-4">
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
            <BrandLogo size={52} />
          </div>
          <p className="text-xs font-semibold tracking-[0.18em] text-white/50">
            KALEIDOSCOPE DENTAL SPECIALISTS
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-black/55">
            Sign in to manage the clinic website.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-black/70">Email address</span>
              <input
                className="h-11 rounded-xl border border-black/10 bg-[#f9f9f9] px-4 text-sm text-[var(--brand-dark)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
                type="email"
                autoComplete="username"
                placeholder="admin@kaleidoscope.co.uk"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-black/70">Password</span>
              <input
                className="h-11 rounded-xl border border-black/10 bg-[#f9f9f9] px-4 text-sm text-[var(--brand-dark)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--gold)] text-sm font-semibold text-[var(--ink-on-gold)] shadow-md transition hover:bg-[var(--gold-2)] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Access restricted to authorised clinic staff only.
        </p>
      </div>
    </div>
  );
}

