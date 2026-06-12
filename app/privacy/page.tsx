import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { CLINIC } from "@/components/siteLinks";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Kaleidoscope Dental Specialists collects, uses, and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains how we handle personal information when you visit our website, contact us, book online, or receive care at Kaleidoscope Dental Specialists."
    >
      <LegalSection title="Who we are">
        <p>
          Kaleidoscope Dental Specialists ({CLINIC.name}) is the data controller
          for personal information described in this policy. Our practice is
          located at {CLINIC.addressLines.join(", ")}.
        </p>
        <p>
          You can contact us at{" "}
          <a
            href={`mailto:${CLINIC.email}`}
            className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
          >
            {CLINIC.email}
          </a>{" "}
          or {CLINIC.phoneDisplay} about privacy matters.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>Depending on how you interact with us, we may collect:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Identity and contact details (name, email, phone number, address)
          </li>
          <li>
            Enquiry and referral information submitted through our website forms
          </li>
          <li>
            Booking and payment details when you reserve a consultation online
          </li>
          <li>
            Clinical and dental records as part of your treatment (handled under
            separate professional obligations)
          </li>
          <li>
            Technical data such as IP address, browser type, and pages visited
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use your information">
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Respond to enquiries, referrals, and contact requests</li>
          <li>Manage appointments, bookings, and deposits</li>
          <li>Provide dental treatment and related administrative care</li>
          <li>Meet legal, regulatory, and professional requirements</li>
          <li>Improve our website and patient experience</li>
          <li>
            Send service-related communications (for example appointment
            confirmations)
          </li>
        </ul>
        <p>
          We process information on lawful bases including contract,
          legitimate interests, legal obligation, and consent where required.
        </p>
      </LegalSection>

      <LegalSection title="Sharing your information">
        <p>
          We do not sell your personal information. We may share data with
          trusted processors who help us operate our practice and website, such
          as:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Payment providers (for online deposits)</li>
          <li>Calendar and booking systems</li>
          <li>Email and hosting providers</li>
          <li>IT and website support services</li>
        </ul>
        <p>
          We may also disclose information where required by law, regulation, or
          professional duty.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          We keep personal information only for as long as necessary for the
          purposes described above, including clinical record retention periods
          required for dental professionals in the UK.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Under UK data protection law, you may have rights to access, correct,
          erase, restrict, or object to certain processing, and to data
          portability where applicable. You may also lodge a complaint with the
          Information Commissioner&apos;s Office (ICO).
        </p>
        <p>
          To exercise your rights, please contact us using the details above.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We apply appropriate technical and organisational measures to protect
          personal information. No method of transmission over the internet is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Related policies">
        <p>
          See also our{" "}
          <Link
            href="/cookies"
            className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
          >
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/terms"
            className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
          >
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
