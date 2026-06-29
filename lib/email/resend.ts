import "server-only";

import { Resend } from "resend";

const CLINIC_FROM_NAME = "Kaleidoscope Website";

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ?? "hello@kaleidoscopedental.co.uk"
  );
}

export function getClinicNotificationEmail(): string {
  return (
    process.env.CONTACT_EMAIL?.trim() ?? "hello@kaleidoscopedental.co.uk"
  );
}

type SendEmailOptions = {
  subject: string;
  html: string;
};

export async function sendClinicEmail({
  subject,
  html,
}: SendEmailOptions): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const fromEmail = getFromAddress();
  const toEmail = getClinicNotificationEmail();

  try {
    await resend.emails.send({
      from: `${CLINIC_FROM_NAME} <${fromEmail}>`,
      to: toEmail,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("sendClinicEmail failed:", err);
    return false;
  }
}

export async function sendPatientEmail({
  to,
  subject,
  html,
}: SendEmailOptions & { to: string }): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const fromEmail = getFromAddress();

  try {
    await resend.emails.send({
      from: `Kaleidoscope Dental <${fromEmail}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("sendPatientEmail failed:", err);
    return false;
  }
}
