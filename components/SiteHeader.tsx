"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CLINIC } from "./siteLinks";
import { CtaButton } from "./CtaButton";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/treatments", label: "Treatments" },
  { href: "/book", label: "Book" },
  { href: "/referral", label: "Referral" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 bg-[var(--charcoal)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[var(--gold)]" />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-white">
              Kaleidoscope
            </div>
            <div className="text-[10px] font-semibold tracking-[0.18em] text-white/70">
              DENTAL SPECIALISTS
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/80 sm:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "transition hover:text-white",
                  active ? "text-white" : "text-white/75",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CtaButton href="/contact#book" variant="primary">
            Book Consultation
          </CtaButton>
          <CtaButton href={CLINIC.phoneHref} variant="secondary">
            Call Us
          </CtaButton>
        </div>
      </div>
    </header>
  );
}

