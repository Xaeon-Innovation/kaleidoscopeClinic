"use client";

import {
  buildGmailComposeUrl,
  buildMailtoUrl,
  buildPatientEmailCompose,
  buildPatientWhatsAppUrl,
  normalizeContactEmail,
  normalizeContactPhone,
} from "@/lib/contact/patientContactLinks";

type PatientContactActionsProps = {
  email: string;
  phone: string;
  name?: string;
  primaryEmailLabel?: string;
  compact?: boolean;
};

const primaryBtn =
  "rounded-xl bg-[var(--brand-dark)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";

const secondaryBtn =
  "rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40";

export function PatientContactActions({
  email,
  phone,
  name,
  primaryEmailLabel = "Email patient",
  compact = false,
}: PatientContactActionsProps) {
  const normalizedEmail = normalizeContactEmail(email);
  const normalizedPhone = normalizeContactPhone(phone);
  const { subject, body } = buildPatientEmailCompose(name);

  const gmailUrl = normalizedEmail
    ? buildGmailComposeUrl({ to: normalizedEmail, subject, body })
    : null;
  const mailtoUrl = normalizedEmail
    ? buildMailtoUrl({ to: normalizedEmail, subject, body })
    : null;
  const whatsappUrl = normalizedPhone
    ? buildPatientWhatsAppUrl(phone, name)
    : null;

  const btnClass = compact ? secondaryBtn : primaryBtn;
  const altBtnClass = secondaryBtn;

  return (
    <div className="flex flex-wrap gap-2">
      {gmailUrl ? (
        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          onClick={(e) => e.stopPropagation()}
        >
          Open in Gmail
        </a>
      ) : (
        <button type="button" className={btnClass} disabled>
          Open in Gmail
        </button>
      )}

      {mailtoUrl ? (
        <a
          href={mailtoUrl}
          className={altBtnClass}
          onClick={(e) => e.stopPropagation()}
        >
          {primaryEmailLabel}
        </a>
      ) : (
        <button type="button" className={altBtnClass} disabled>
          {primaryEmailLabel}
        </button>
      )}

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={altBtnClass}
          onClick={(e) => e.stopPropagation()}
        >
          WhatsApp
        </a>
      ) : (
        <button type="button" className={altBtnClass} disabled title="No valid phone number">
          WhatsApp
        </button>
      )}
    </div>
  );
}
