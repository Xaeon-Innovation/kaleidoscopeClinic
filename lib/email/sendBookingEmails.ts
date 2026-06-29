import "server-only";

import type { DocumentReference } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import type Stripe from "stripe";
import { CLINIC } from "@/components/siteLinks";
import { sendClinicEmail, sendPatientEmail } from "@/lib/email/resend";
import {
  bookingPatientThankYouEmailHtml,
  bookingPatientThankYouEmailSubject,
  bookingStaffEmailHtml,
  bookingStaffEmailSubject,
  formatDepositAmount,
} from "@/lib/email/templates";

export type BookingEmailPayload = {
  sessionId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  consultationTreatmentName: string;
  slotStart: Date;
  slotEnd: Date;
  patientNote?: string;
  depositAmount: string;
};

export function bookingPayloadFromSession(
  session: Stripe.Checkout.Session,
  data: Omit<BookingEmailPayload, "depositAmount" | "sessionId">
): BookingEmailPayload {
  return {
    ...data,
    sessionId: session.id,
    depositAmount: formatDepositAmount(
      session.amount_total,
      session.currency
    ),
  };
}

export async function sendBookingConfirmationEmails(
  appointmentRef: DocumentReference,
  payload: BookingEmailPayload,
  existingEmailsSentAt: unknown
): Promise<void> {
  if (existingEmailsSentAt) return;

  const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
  if (!resendConfigured) return;

  const staffHtml = bookingStaffEmailHtml({
    ...payload,
    stripeSessionId: payload.sessionId,
  });
  const staffSubject = bookingStaffEmailSubject({
    ...payload,
    stripeSessionId: payload.sessionId,
  });

  const patientHtml = bookingPatientThankYouEmailHtml({
    patientName: payload.patientName,
    consultationTreatmentName: payload.consultationTreatmentName,
    slotStart: payload.slotStart,
    slotEnd: payload.slotEnd,
    depositAmount: payload.depositAmount,
    clinicAddress: CLINIC.addressLines.join(", "),
    clinicPhone: CLINIC.phoneDisplay,
    clinicEmail: CLINIC.email,
  });

  try {
    const [staffSent, patientSent] = await Promise.all([
      sendClinicEmail({ subject: staffSubject, html: staffHtml }),
      sendPatientEmail({
        to: payload.patientEmail,
        subject: bookingPatientThankYouEmailSubject(),
        html: patientHtml,
      }),
    ]);

    if (staffSent && patientSent) {
      await appointmentRef.update({
        emailsSentAt: FieldValue.serverTimestamp(),
      });
    } else {
      console.warn("booking emails partially failed", payload.sessionId, {
        staffSent,
        patientSent,
      });
    }
  } catch (err) {
    console.error("sendBookingConfirmationEmails failed", payload.sessionId, err);
  }
}
