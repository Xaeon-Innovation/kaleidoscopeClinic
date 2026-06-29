"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";
import type { OpeningHourRow } from "@/lib/booking/openingHours";
import type { PublicContactSettings } from "@/lib/site/contactSettingsTypes";
import { submitSubscribe } from "@/lib/subscribers/submitSubscribe";
import { CLINIC, GOOGLE_MAPS_URL, whatsappHrefFromNumber } from "./siteLinks";

const clinicLinks = [
  { href: "/about", label: "About Us" },
  { href: "/about#team", label: "Meet the Team" },
  { href: "/#testimonials", label: "Patient Reviews" },
  { href: "/treatments", label: "Treatments" },
  { href: "/book", label: "Book Online" },
  { href: "/referral", label: "Refer a Patient" },
  { href: "/contact", label: "Contact Us" },
];

const popularTreatmentLinks = [
  { href: "/treatments/full-arch-implants", label: "Full Arch Implants" },
  { href: "/treatments/dental-implants", label: "Dental Implants" },
  { href: "/treatments/smile-makeovers", label: "Smile Makeovers" },
  { href: "/treatments/full-mouth-rehabilitation", label: "Full Mouth Rehabilitation" },
];

const trustBadges = [
  "GDC Registered Specialists",
  "Specialist-Led Care",
  "Digital Treatment Planning",
  "5-Star Patient Care",
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/cookies", label: "Cookie Policy" },
];

type FooterProps = {
  clinicName: string;
  contact: PublicContactSettings;
  tagline: string;
  openingHours: OpeningHourRow[];
};

function phoneHref(phone: string) {
  const trimmed = phone.trim();
  if (trimmed.startsWith("tel:")) return trimmed;
  if (trimmed.startsWith("+")) return `tel:${trimmed.replace(/\s/g, "")}`;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0")) return `tel:+44${digits.slice(1)}`;
  return digits ? `tel:+${digits}` : "#";
}

function iconClass(className?: string, size = "h-4 w-4") {
  return [`${size} shrink-0`, className].filter(Boolean).join(" ");
}

function IconPin({ className, size }: { className?: string; size?: string }) {
  return (
    <svg className={iconClass(className, size)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="11" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={iconClass(className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 4h3l1.2 3.2-1.8 1.2a11 11 0 0 0 5.9 5.9l1.2-1.8L19 14v3a1.5 1.5 0 0 1-1.6 1.5C10.2 18.5 5.5 13.8 5.5 6.1A1.5 1.5 0 0 1 6.5 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={iconClass(className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg className={iconClass(className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m10 7 5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconDiamond({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 0 12 6 6 12 0 6 6 0Z" />
    </svg>
  );
}

function IconBadge({ className }: { className?: string }) {
  return (
    <svg className={iconClass(className, "h-3.5 w-3.5")} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m8.5 12 2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const socialIcons: Record<string, ReactNode> = {
  Facebook: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8.5V7.2c0-.7.5-1.2 1.3-1.2H17V3h-2.2C12.8 3 12 4.5 12 6.2V8.5H10v3h2V21h2v-9.5h2.7l.3-3H14Z" />
    </svg>
  ),
  Instagram: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  ),
  X: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  YouTube: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 9.5v5l5-2.5-5-2.5Z" fill="currentColor" />
      <path
        d="M21 8.5s-.2-1.6-.9-2.3c-.8-.8-1.7-.8-2.1-.9C16.4 5 12 5 12 5s-4.4 0-5.9.3c-.4 0-1.3.1-2.1.9-.7.7-.9 2.3-.9 2.3S3 10.1 3 11.7v1.6c0 1.6.2 3.2.2 3.2s.2 1.6.9 2.3c.8.8 1.9.8 2.4.9 1.8.2 7.5.2 7.5.2s4.4 0 5.9-.3c.4 0 1.3-.1 2.1-.9.7-.7.9-2.3.9-2.3s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  ),
};

function SocialIcon({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="site-footer-social"
      aria-label={label}
    >
      {socialIcons[label]}
    </a>
  );
}

export default function Footer({
  clinicName,
  contact,
  tagline,
  openingHours,
}: FooterProps) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "sending" | "error"
  >("idle");
  const whatsappHref = contact.whatsapp
    ? whatsappHrefFromNumber(contact.whatsapp)
    : "";
  const socialLinks = [
    contact.social.facebook
      ? { label: "Facebook" as const, href: contact.social.facebook }
      : null,
    contact.social.instagram
      ? { label: "Instagram" as const, href: contact.social.instagram }
      : null,
    contact.social.x ? { label: "X" as const, href: contact.social.x } : null,
    contact.social.youtube
      ? { label: "YouTube" as const, href: contact.social.youtube }
      : null,
  ].filter(Boolean) as { label: string; href: string }[];

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    setSubscribeStatus("sending");
    try {
      await submitSubscribe(trimmed);
      setSubscribed(true);
      setEmailInput("");
      setSubscribeStatus("idle");
    } catch {
      setSubscribeStatus("error");
    }
  }

  return (
    <footer className="site-footer">
      {/* Main three-column grid */}
      <section className="site-footer-inner grid gap-10 py-10 sm:py-12 lg:grid-cols-[1.35fr_0.9fr_1fr] lg:gap-8">
          {/* Brand + newsletter */}
          <div className="space-y-6">
            <BrandWordmark variant="dark" size={40} textScale="lg" href="/" />
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              {tagline}
            </p>

            <form
              className="site-footer-glass space-y-3 p-4 sm:p-5"
              onSubmit={handleSubscribe}
            >
              <p className="text-sm text-white/75">
                Get dental tips &amp; exclusive patient offers
              </p>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                placeholder="your@email.com"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/45 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
              />
              <button
                type="submit"
                disabled={subscribeStatus === "sending" || subscribed}
                className="h-10 w-full rounded-xl bg-[var(--gold)] text-sm font-semibold text-[var(--ink-on-gold)] transition hover:bg-[var(--gold-2)] disabled:opacity-60"
              >
                {subscribeStatus === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
              {subscribed ? (
                <p className="text-xs text-white/65">
                  Thank you — you&apos;re on the list.
                </p>
              ) : subscribeStatus === "error" ? (
                <p className="text-xs text-red-300">
                  Something went wrong. Please try again.
                </p>
              ) : null}
            </form>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ label, href }) => (
                  <SocialIcon key={label} label={label} href={href} />
                ))}
              </div>
            ) : null}
          </div>

          {/* Clinic links */}
          <div>
            <p className="site-footer-label">Clinic</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {clinicLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="site-footer-label mt-8">Popular treatments</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {popularTreatmentLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening hours */}
          <div>
            <p className="site-footer-label">Opening hours</p>
            <ul className="mt-5 space-y-2 text-sm">
              {openingHours.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center justify-between gap-4 text-white/75"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {row.highlight ? (
                      <IconDiamond className="text-[var(--gold)]" />
                    ) : null}
                    <span
                      className={
                        row.highlight ? "text-white" : undefined
                      }
                    >
                      {row.day}
                    </span>
                  </span>
                  <span className="text-right">{row.hours}</span>
                </li>
              ))}
            </ul>

            {whatsappHref ? (
              <div className="site-footer-glass mt-5 flex items-center gap-2.5 px-4 py-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)]/50 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--gold)]" />
                </span>
                <span className="text-xs text-white/75">
                  WhatsApp line — message us anytime
                </span>
              </div>
            ) : null}
          </div>
        </section>

      {/* Trust badges + contact + CTA */}
      <section className="site-footer-inner border-t border-[var(--footer-border)] py-8">
          <div className="flex flex-wrap gap-2">
            {trustBadges.map((badge) => (
              <span key={badge} className="site-footer-badge">
                <IconBadge />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-start gap-2 text-white/75 transition hover:text-white"
              >
                <IconPin className="mt-0.5 text-[var(--gold)]" />
                <span>{CLINIC.addressLines.join(", ")}</span>
              </a>
              {contact.phone ? (
                <a
                  href={phoneHref(contact.phone)}
                  className="inline-flex items-center gap-2 whitespace-nowrap text-white/75 transition hover:text-white"
                >
                  <IconPhone className="text-[var(--gold)]" />
                  {contact.phone}
                </a>
              ) : null}
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex min-w-0 max-w-full items-center gap-2 text-white/75 transition hover:text-white"
                >
                  <IconMail className="text-[var(--gold)]" />
                  <span className="break-all sm:break-words">{contact.email}</span>
                </a>
              ) : null}
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap text-white/75 transition hover:text-white"
                >
                  <span className="text-[var(--gold)]">●</span>
                  Message on WhatsApp
                </a>
              ) : null}
            </div>

            <Link href="/book" className="site-footer-cta shrink-0">
              Book Appointment
              <IconChevron />
            </Link>
          </div>
        </section>

      {/* Legal bar */}
      <section className="site-footer-inner border-t border-[var(--footer-border)] py-5">
          <div className="flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} {clinicName}. All rights reserved.
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-white/65"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
    </footer>
  );
}
