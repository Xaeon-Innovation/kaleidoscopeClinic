import "server-only";

import { CLINIC } from "@/components/siteLinks";
import { sendPatientEmail } from "@/lib/email/resend";
import {
  referralDentistThankYouEmailHtml,
  referralDentistThankYouEmailSubject,
  referralPatientThankYouEmailHtml,
  referralPatientThankYouEmailSubject,
} from "@/lib/email/templates";

type ReferralEmailRecipients = {
  dentistName: string;
  dentistEmail: string;
  patientName: string;
  patientEmail: string;
};

export async function sendReferralThankYouEmails({
  dentistName,
  dentistEmail,
  patientName,
  patientEmail,
}: ReferralEmailRecipients): Promise<void> {
  if (!process.env.RESEND_API_KEY?.trim()) return;

  const clinicPhone = CLINIC.phoneDisplay;
  const clinicEmail = CLINIC.email;

  try {
    const [dentistSent, patientSent] = await Promise.all([
      sendPatientEmail({
        to: dentistEmail,
        subject: referralDentistThankYouEmailSubject(),
        html: referralDentistThankYouEmailHtml({
          dentistName,
          patientName,
          clinicPhone,
          clinicEmail,
        }),
      }),
      sendPatientEmail({
        to: patientEmail,
        subject: referralPatientThankYouEmailSubject(),
        html: referralPatientThankYouEmailHtml({
          patientName,
          clinicPhone,
          clinicEmail,
        }),
      }),
    ]);

    if (!dentistSent || !patientSent) {
      console.warn("referral thank-you emails partially failed", {
        dentistSent,
        patientSent,
      });
    }
  } catch (err) {
    console.error("sendReferralThankYouEmails failed", err);
  }
}
