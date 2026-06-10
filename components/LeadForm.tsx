"use client";

import { useMemo, useState } from "react";
import { submitLead } from "@/lib/leads/submitLead";

function getUtm() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function LeadForm({
  sourcePage,
  variant = "enquiry",
}: {
  sourcePage: string;
  variant?: "enquiry" | "contact";
}) {
  const isContact = variant === "contact";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend = useMemo(() => {
    return (
      name.trim().length > 1 &&
      email.trim().includes("@") &&
      phone.trim().length >= 6 &&
      message.trim().length >= 10
    );
  }, [email, message, name, phone]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (botField) return; // honeypot
    setStatus("sending");
    try {
      await submitLead({
        name,
        email,
        phone,
        message,
        sourcePage,
        preferredContact: "form",
        utm: getUtm(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3">
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-black/70">Full name</span>
        <input
          className="h-11 rounded-2xl border border-black/10 bg-[var(--surface-2)] px-4 text-sm outline-none focus:border-[var(--gold)]"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-black/70">Email</span>
        <input
          className="h-11 rounded-2xl border border-black/10 bg-[var(--surface-2)] px-4 text-sm outline-none focus:border-[var(--gold)]"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-black/70">Phone</span>
        <input
          className="h-11 rounded-2xl border border-black/10 bg-[var(--surface-2)] px-4 text-sm outline-none focus:border-[var(--gold)]"
          name="phone"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-black/70">
          {isContact ? "Your message" : "How can we help?"}
        </span>
        <textarea
          className="min-h-28 rounded-2xl border border-black/10 bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      {/* Honeypot */}
      <label className="hidden">
        <span>Website</span>
        <input
          aria-label="Website"
          value={botField}
          onChange={(e) => setBotField(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <button
        type="submit"
        disabled={!canSend || status === "sending" || status === "sent"}
        className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] hover:bg-[var(--gold-2)] disabled:opacity-60"
      >
        {status === "sending"
          ? "Sending…"
          : status === "sent"
            ? "Sent"
            : isContact
              ? "Send message"
              : "Send enquiry"}
      </button>

      {status === "sent" ? (
        <p className="text-xs text-black/60">
          {isContact
            ? "Thanks — your message has been sent. We’ll be in touch shortly."
            : "Thanks — we’ve received your enquiry and will be in touch shortly."}
        </p>
      ) : status === "error" ? (
        <p className="text-xs text-red-700">
          Something went wrong. Please try again, or message us on WhatsApp.
        </p>
      ) : (
        <p className="text-xs text-black/55">
          Prefer WhatsApp? Use the button above for the fastest response.
        </p>
      )}
    </form>
  );
}

