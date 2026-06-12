"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden
    >
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

function MobileMenu({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--brand-dark)]/40"
        aria-label="Close menu"
        onClick={onClose}
      />

      <nav
        id="mobile-nav-panel"
        className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-2xl"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-[var(--brand-dark)]/8 px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-dark)]/55">
            Menu
          </span>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--brand-dark)]/70 hover:bg-[var(--brand-dark)]/5"
            onClick={onClose}
            aria-label="Close menu"
          >
            <MenuIcon open />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={[
                      "flex min-h-11 items-center rounded-xl px-4 text-base font-medium transition-colors",
                      active
                        ? "bg-[var(--brand-dark)] text-white"
                        : "text-[var(--brand-dark)]/80 hover:bg-[var(--surface-warm)] hover:text-[var(--brand-dark)]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-2 border-t border-[var(--brand-dark)]/8 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <CtaButton
            href="/book"
            variant="primary"
            className="h-11 w-full"
            onClick={onClose}
          >
            Book Consultation
          </CtaButton>
          <CtaButton
            href={CLINIC.phoneHref}
            variant="secondary"
            className="h-11 w-full"
            onClick={onClose}
          >
            Call {CLINIC.phoneDisplay}
          </CtaButton>
        </div>
      </nav>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-40",
          "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out",
          scrolled || menuOpen
            ? "border-b border-[var(--brand-dark)]/[0.05] bg-white/72 shadow-[0_8px_30px_rgba(2,44,34,0.04)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent backdrop-blur-sm",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--gold)] ring-2 ring-[var(--gold)]/25 transition group-hover:ring-[var(--gold)]/45" />
            <div className="min-w-0 leading-tight">
              <div className="truncate font-[var(--font-serif)] text-lg font-medium tracking-tight text-[var(--brand-dark)] sm:text-xl">
                Kaleidoscope
              </div>
              <div className="text-[10px] font-semibold tracking-[0.18em] text-[var(--brand-dark)]/55">
                DENTAL SPECIALISTS
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm lg:flex xl:gap-7">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative py-1 transition-colors",
                    active
                      ? "font-medium text-[var(--brand-dark)] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-[var(--gold)]"
                      : "text-[var(--brand-dark)]/60 hover:text-[var(--brand-dark)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <CtaButton href="/book" variant="primary">
              Book Consultation
            </CtaButton>
            <CtaButton href={CLINIC.phoneHref} variant="secondary">
              Call Us
            </CtaButton>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--brand-dark)]/10 bg-white/80 text-[var(--brand-dark)] transition hover:border-[var(--brand-dark)]/20 hover:bg-white lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </header>

      {mounted
        ? createPortal(
            <MobileMenu
              open={menuOpen}
              pathname={pathname}
              onClose={closeMenu}
            />,
            document.body,
          )
        : null}
    </>
  );
}
