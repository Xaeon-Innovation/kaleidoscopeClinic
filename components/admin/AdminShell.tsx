"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

type AdminState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "notAdmin"; user: User }
  | { status: "admin"; user: User };

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/before-after", label: "Before & After" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      if (!user) {
        setState({ status: "signedOut" });
        return;
      }
      try {
        const adminDoc = await getDoc(doc(getFirebaseDb(), "admins", user.uid));
        if (adminDoc.exists()) setState({ status: "admin", user });
        else setState({ status: "notAdmin", user });
      } catch {
        setState({ status: "notAdmin", user });
      }
    });
    return () => unsub();
  }, []);

  const showNav = useMemo(() => pathname.startsWith("/admin"), [pathname]);

  useEffect(() => {
    if (state.status === "signedOut") router.replace("/admin/login");
  }, [router, state.status]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
          Loading…
        </div>
      </div>
    );
  }

  if (state.status === "signedOut") return null;

  if (state.status === "notAdmin") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
          <h1 className="text-base font-semibold tracking-tight">
            Access denied
          </h1>
          <p className="mt-2 text-sm text-black/65">
            Your account is signed in, but it isn’t listed as an admin in
            Firestore.
          </p>
          <button
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-5 text-sm font-semibold text-[var(--ink-on-gold)] hover:bg-[var(--gold-2)]"
            onClick={() => signOut(getFirebaseAuth())}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--surface)]">
      {showNav && (
        <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--surface)]/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/admin" className="font-semibold tracking-tight">
              Admin
            </Link>
            <nav className="hidden gap-5 text-sm md:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={[
                    "transition hover:text-black",
                    pathname === n.href ? "text-black" : "text-black/70",
                  ].join(" ")}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <button
              className="rounded-full px-3 py-2 text-sm font-semibold text-black/70 ring-1 ring-black/10 hover:bg-black/[0.03]"
              onClick={() => signOut(getFirebaseAuth())}
            >
              Sign out
            </button>
          </div>
        </header>
      )}
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}

