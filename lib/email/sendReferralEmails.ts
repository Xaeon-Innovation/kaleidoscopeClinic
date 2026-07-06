import "server-only";

import { CLINIC } from "@/components/siteLinks";
import { sendClinicEmail, sendPatientEmail } from "@/lib/email/resend";
import {
  referralDentistThankYouEmailHtml,
  referralDentistThankYouEmailSubject,
  referralPatientThankYouEmailHtml,
  referralPatientThankYouEmailSubject,
  referralStaffEmailHtml,
  referralStaffEmailSubject,
  type ReferralStaffEmailData,
} from "@/lib/email/templates";

type ReferralEmailPayload = ReferralStaffEmailData;

export async function sendReferralEmails(data: ReferralEmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY?.trim()) return;

  const clinicPhone = CLINIC.phoneDisplay;
  const clinicEmail = CLINIC.email;
  const { referringDentist, patient } = data;

  try {
    const [staffSent, dentistSent, patientSent] = await Promise.all([
      sendClinicEmail({
        subject: referralStaffEmailSubject(patient.name),
        html: referralStaffEmailHtml(data),
      }),
      sendPatientEmail({
        to: referringDentist.email,
        subject: referralDentistThankYouEmailSubject(),
        html: referralDentistThankYouEmailHtml({
          dentistName: referringDentist.name,
          patientName: patient.name,
          clinicPhone,
          clinicEmail,
        }),
      }),
      sendPatientEmail({
        to: patient.email,
        subject: referralPatientThankYouEmailSubject(),
        html: referralPatientThankYouEmailHtml({
          patientName: patient.name,
          clinicPhone,
          clinicEmail,
        }),
      }),
    ]);

    if (!staffSent || !dentistSent || !patientSent) {
      console.warn("referral emails partially failed", {
        staffSent,
        dentistSent,
        patientSent,
      });
    }
  } catch (err) {
    console.error("sendReferralEmails failed", err);
  }
}
