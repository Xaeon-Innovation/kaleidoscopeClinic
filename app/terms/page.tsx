import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { CLINIC } from "@/components/siteLinks";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of the Kaleidoscope Dental Specialists website and online services.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Please read these terms before using our website, submitting enquiries, or booking online with Kaleidoscope Dental Specialists."
    >
      <LegalSection title="Agreement">
        <p>
          By accessing this website, you agree to these Terms of Service. If you
          do not agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="About our website">
        <p>
          This website provides general information about {CLINIC.name},
          our treatments, and how to contact or book with the practice. Content
          is provided for information purposes and does not replace a clinical
          examination or personalised advice from a registered dental
          professional.
        </p>
      </LegalSection>

      <LegalSection title="Online bookings and payments">
        <p>
          When you book a consultation online, you agree to provide accurate
          information and to pay any stated deposit where required. Appointment
          availability is subject to confirmation. We may cancel or reschedule
          appointments where necessary and will contact you as soon as
          reasonably possible.
        </p>
        <p>
          Deposit and cancellation terms communicated at the time of booking form
          part of your agreement with the practice.
        </p>
      </LegalSection>

      <LegalSection title="Enquiries and referrals">
        <p>
          Information submitted through contact, enquiry, or referral forms must
          be accurate to the best of your knowledge. Submitting a form does not
          create a clinician–patient relationship until the practice has accepted
          you for care.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the website unlawfully or in a way that could harm others</li>
          <li>Attempt unauthorised access to our systems or data</li>
          <li>Introduce malware or interfere with site operation</li>
          <li>Copy, scrape, or republish content without permission</li>
        </ul>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Unless stated otherwise, text, images, branding, and design on this
          website are owned by or licensed to {CLINIC.name}. You may view and
          print pages for personal, non-commercial use only.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          We aim to keep website information accurate and up to date, but we do
          not warrant that content is complete, current, or error-free. To the
          extent permitted by law, we exclude liability for loss arising from
          reliance on website content alone.
        </p>
      </LegalSection>

      <LegalSection title="Third-party links">
        <p>
          Our website may link to third-party services (for example payment or
          mapping providers). We are not responsible for their content or
          privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms from time to time. The &quot;Last
          updated&quot; date at the top of this page indicates when they were
          last revised. Continued use of the website after changes constitutes
          acceptance of the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of England and Wales. Courts in
          England and Wales have exclusive jurisdiction, subject to your
          statutory rights.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For questions about these terms, please{" "}
          <Link
            href="/contact"
            className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
          >
            contact us
          </Link>{" "}
          or call {CLINIC.phoneDisplay}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
