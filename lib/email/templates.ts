import { CLINIC_TIMEZONE } from "@/lib/booking/timezone";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tableRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#555;width:130px">${escapeHtml(label)}</td><td style="padding:6px 0">${value}</td></tr>`;
}

function emailShell(title: string, body: string): string {
  return `
    <h2 style="font-family:serif;margin:0 0 16px">${escapeHtml(title)}</h2>
    ${body}
  `;
}

export function formatBookingSlot(start: Date, end: Date): string {
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: CLINIC_TIMEZONE,
  });
  const timeFmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: CLINIC_TIMEZONE,
  });
  return `${dateFmt.format(start)}, ${timeFmt.format(start)} – ${timeFmt.format(end)} (UK time)`;
}

export function formatDepositAmount(
  amountTotal: number | null | undefined,
  currency: string | null | undefined
): string {
  if (amountTotal == null || !currency) return "—";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amountTotal / 100);
  } catch {
    return `${amountTotal / 100} ${currency.toUpperCase()}`;
  }
}

export type ContactLeadEmailData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: string;
  sourcePage: string;
  isContact: boolean;
};

export function contactLeadEmailSubject(data: ContactLeadEmailData): string {
  return data.isContact
    ? `New contact message: ${data.name}`
    : `New Enquiry: ${data.name}`;
}

export function contactLeadEmailHtml(data: ContactLeadEmailData): string {
  const title = data.isContact
    ? "New contact message"
    : "New consultation enquiry";

  const table = `
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      ${tableRow("Name", `<strong>${escapeHtml(data.name)}</strong>`)}
      ${tableRow("Email", `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`)}
      ${tableRow("Phone", `<a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`)}
      ${tableRow("Via", escapeHtml(data.preferredContact))}
      ${tableRow("Source", escapeHtml(data.sourcePage))}
    </table>
    <div style="margin-top:16px;background:#f5f5f5;padding:16px;border-radius:8px;font-family:sans-serif;font-size:14px;line-height:1.6">
      ${escapeHtml(data.message).replace(/\n/g, "<br/>")}
    </div>
  `;

  return emailShell(title, table);
}

export type BookingStaffEmailData = {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  consultationTreatmentName: string;
  slotStart: Date;
  slotEnd: Date;
  patientNote?: string;
  stripeSessionId: string;
  depositAmount: string;
};

export function bookingStaffEmailSubject(data: BookingStaffEmailData): string {
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: CLINIC_TIMEZONE,
  });
  return `New booking: ${data.patientName} — ${dateFmt.format(data.slotStart)}`;
}

export function bookingStaffEmailHtml(data: BookingStaffEmailData): string {
  const table = `
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      ${tableRow("Patient", `<strong>${escapeHtml(data.patientName)}</strong>`)}
      ${tableRow("Email", `<a href="mailto:${escapeHtml(data.patientEmail)}">${escapeHtml(data.patientEmail)}</a>`)}
      ${tableRow("Phone", `<a href="tel:${escapeHtml(data.patientPhone)}">${escapeHtml(data.patientPhone)}</a>`)}
      ${tableRow("Treatment", escapeHtml(data.consultationTreatmentName))}
      ${tableRow("Appointment", escapeHtml(formatBookingSlot(data.slotStart, data.slotEnd)))}
      ${tableRow("Deposit paid", escapeHtml(data.depositAmount))}
      ${tableRow("Stripe session", escapeHtml(data.stripeSessionId))}
    </table>
    ${
      data.patientNote
        ? `<div style="margin-top:16px;background:#f5f5f5;padding:16px;border-radius:8px;font-family:sans-serif;font-size:14px;line-height:1.6"><strong>Note from patient</strong><br/>${escapeHtml(data.patientNote).replace(/\n/g, "<br/>")}</div>`
        : ""
    }
  `;

  return emailShell("New consultation booking", table);
}

export type BookingPatientEmailData = {
  patientName: string;
  consultationTreatmentName: string;
  slotStart: Date;
  slotEnd: Date;
  depositAmount: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
};

export function bookingPatientThankYouEmailSubject(): string {
  return "Your consultation is confirmed — Kaleidoscope Dental";
}

export function bookingPatientThankYouEmailHtml(
  data: BookingPatientEmailData
): string {
  const firstName = data.patientName.split(/\s+/)[0] || data.patientName;

  const body = `
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      Dear ${escapeHtml(firstName)},
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      Thank you for booking your consultation with Kaleidoscope Dental Specialists. Your deposit of <strong>${escapeHtml(data.depositAmount)}</strong> has been received and your appointment is confirmed.
    </p>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;margin:16px 0">
      ${tableRow("Treatment", escapeHtml(data.consultationTreatmentName))}
      ${tableRow("Date & time", escapeHtml(formatBookingSlot(data.slotStart, data.slotEnd)))}
      ${tableRow("Location", escapeHtml(data.clinicAddress))}
    </table>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      A calendar invitation has also been sent to your email. Please arrive a few minutes early and bring any relevant dental records if you have them.
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      If you need to reschedule or have any questions, please contact us at
      <a href="tel:${escapeHtml(data.clinicPhone)}">${escapeHtml(data.clinicPhone)}</a>
      or <a href="mailto:${escapeHtml(data.clinicEmail)}">${escapeHtml(data.clinicEmail)}</a>.
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333;margin-top:24px">
      We look forward to seeing you.<br/>
      <strong>Kaleidoscope Dental Specialists</strong>
    </p>
  `;

  return emailShell("Your consultation is confirmed", body);
}

export function newsletterSignupStaffEmailSubject(email: string): string {
  return `New newsletter subscriber: ${email}`;
}

export function newsletterSignupStaffEmailHtml(email: string): string {
  const table = `
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      ${tableRow("Email", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
      ${tableRow("Source", "Website footer")}
    </table>
  `;

  return emailShell("New newsletter subscriber", table);
}

export type ReferralDentistThankYouEmailData = {
  dentistName: string;
  patientName: string;
  clinicPhone: string;
  clinicEmail: string;
};

export function referralDentistThankYouEmailSubject(): string {
  return "Thank you for your referral — Kaleidoscope Dental";
}

export function referralDentistThankYouEmailHtml(
  data: ReferralDentistThankYouEmailData
): string {
  const body = `
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      Dear ${escapeHtml(data.dentistName)},
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      Thank you for referring <strong>${escapeHtml(data.patientName)}</strong> to Kaleidoscope Dental Specialists. We have successfully received your referral and will contact the patient directly to arrange their consultation.
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      If you have any questions, please contact us at
      <a href="tel:${escapeHtml(data.clinicPhone)}">${escapeHtml(data.clinicPhone)}</a>
      or <a href="mailto:${escapeHtml(data.clinicEmail)}">${escapeHtml(data.clinicEmail)}</a>.
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333;margin-top:24px">
      Kind regards,<br/>
      <strong>Kaleidoscope Dental Specialists</strong>
    </p>
  `;

  return emailShell("Referral received", body);
}

export type ReferralPatientThankYouEmailData = {
  patientName: string;
  clinicPhone: string;
  clinicEmail: string;
};

export function referralPatientThankYouEmailSubject(): string {
  return "Your referral has been received — Kaleidoscope Dental";
}

export function referralPatientThankYouEmailHtml(
  data: ReferralPatientThankYouEmailData
): string {
  const firstName = data.patientName.split(/\s+/)[0] || data.patientName;

  const body = `
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      Dear ${escapeHtml(firstName)},
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      We have received your referral to Kaleidoscope Dental Specialists. We will contact you in the next few days to arrange your consultation.
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      Thank you for your patience. If you have any questions in the meantime, please contact us at
      <a href="tel:${escapeHtml(data.clinicPhone)}">${escapeHtml(data.clinicPhone)}</a>
      or <a href="mailto:${escapeHtml(data.clinicEmail)}">${escapeHtml(data.clinicEmail)}</a>.
    </p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333;margin-top:24px">
      Kind regards,<br/>
      <strong>Kaleidoscope Dental Specialists</strong>
    </p>
  `;

  return emailShell("Referral received", body);
}

export type ReferralStaffEmailData = {
  referringDentist: {
    name: string;
    practice: string;
    address: string;
    postcode: string;
    contact: string;
    email: string;
  };
  patient: {
    name: string;
    dateOfBirth: string;
    address: string;
    postcode: string;
    contact: string;
    email: string;
    gpAddress: string;
  };
  implantInterests: string[];
  clinicalHistory: string;
  medicalHistory: string;
  radiographSelections: string[];
  radiographOther: string;
  imagingNotes: string;
  attachmentUrls: string[];
  signature: string;
  signedDate: string;
};

export function referralStaffEmailSubject(patientName: string): string {
  return `New referral: ${patientName}`;
}

function formatList(items: string[]): string {
  if (items.length === 0) return "—";
  return items.map((item) => escapeHtml(item)).join(", ");
}

function textBlock(label: string, value: string): string {
  return `
    <div style="margin-top:16px">
      <p style="font-family:sans-serif;font-size:13px;font-weight:600;color:#333;margin:0 0 6px">${escapeHtml(label)}</p>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
        ${escapeHtml(value).replace(/\n/g, "<br/>")}
      </div>
    </div>
  `;
}

export function referralStaffEmailHtml(data: ReferralStaffEmailData): string {
  const rd = data.referringDentist;
  const pt = data.patient;

  const dentistTable = `
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      ${tableRow("Name", `<strong>${escapeHtml(rd.name)}</strong>`)}
      ${tableRow("Practice", escapeHtml(rd.practice))}
      ${tableRow("Address", escapeHtml(`${rd.address}, ${rd.postcode}`))}
      ${tableRow("Phone", `<a href="tel:${escapeHtml(rd.contact)}">${escapeHtml(rd.contact)}</a>`)}
      ${tableRow("Email", `<a href="mailto:${escapeHtml(rd.email)}">${escapeHtml(rd.email)}</a>`)}
    </table>
  `;

  const patientTable = `
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;margin-top:16px">
      ${tableRow("Name", `<strong>${escapeHtml(pt.name)}</strong>`)}
      ${tableRow("Date of birth", escapeHtml(pt.dateOfBirth))}
      ${tableRow("Address", escapeHtml(`${pt.address}, ${pt.postcode}`))}
      ${tableRow("Phone", `<a href="tel:${escapeHtml(pt.contact)}">${escapeHtml(pt.contact)}</a>`)}
      ${tableRow("Email", `<a href="mailto:${escapeHtml(pt.email)}">${escapeHtml(pt.email)}</a>`)}
      ${pt.gpAddress ? tableRow("GP practice", escapeHtml(pt.gpAddress)) : ""}
    </table>
  `;

  const attachments =
    data.attachmentUrls.length > 0
      ? data.attachmentUrls
          .map(
            (url, index) =>
              `<a href="${escapeHtml(url)}">Attachment ${index + 1}</a>`
          )
          .join("<br/>")
      : "—";

  const body = `
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333">
      A new implant referral has been submitted on the website.
    </p>
    <h3 style="font-family:serif;font-size:16px;margin:20px 0 8px">Referring dentist</h3>
    ${dentistTable}
    <h3 style="font-family:serif;font-size:16px;margin:20px 0 8px">Patient</h3>
    ${patientTable}
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;margin-top:16px">
      ${tableRow("Treatment interests", formatList(data.implantInterests))}
      ${tableRow("Radiographs", formatList(data.radiographSelections))}
      ${data.radiographOther ? tableRow("Other imaging", escapeHtml(data.radiographOther)) : ""}
      ${tableRow("Signed by", escapeHtml(data.signature))}
      ${tableRow("Signed date", escapeHtml(data.signedDate))}
      ${tableRow("Attachments", attachments)}
    </table>
    ${textBlock("Clinical history", data.clinicalHistory)}
    ${textBlock("Medical history", data.medicalHistory)}
    ${data.imagingNotes ? textBlock("Imaging notes", data.imagingNotes) : ""}
  `;

  return emailShell("New referral received", body);
}
