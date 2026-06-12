import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { CLINIC } from "@/components/siteLinks";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Accessibility",
  description:
    "Our commitment to making the Kaleidoscope Dental Specialists website accessible to all users.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      description="We want everyone to be able to use our website and access information about our specialist dental services."
    >
      <LegalSection title="Our commitment">
        <p>
          {CLINIC.name} is committed to providing a website that is accessible
          to the widest possible audience, including people with disabilities or
          impairments that affect how they use the web.
        </p>
        <p>
          We aim to conform with the Web Content Accessibility Guidelines (WCAG)
          2.1 at Level AA where reasonably practicable.
        </p>
      </LegalSection>

      <LegalSection title="What we are doing">
        <p>Measures we take or are working towards include:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Using clear headings, labels, and readable contrast</li>
          <li>Providing text alternatives for meaningful images where needed</li>
          <li>Designing forms and navigation to work with keyboard and screen readers</li>
          <li>Testing pages on common browsers and device sizes</li>
          <li>Reviewing new content and features for accessibility impact</li>
        </ul>
      </LegalSection>

      <LegalSection title="Physical access to the clinic">
        <p>
          If you need information about physical access to our Marylebone
          practice, mobility support, or adjustments during your visit, please
          contact us before your appointment so we can help you plan ahead.
        </p>
      </LegalSection>

      <LegalSection title="Known limitations">
        <p>
          Some third-party content embedded on the site (for example maps or
          payment flows) may not fully meet our accessibility standards. We
          choose providers carefully and welcome feedback where you encounter
          barriers.
        </p>
      </LegalSection>

      <LegalSection title="Feedback and assistance">
        <p>
          If you have difficulty using any part of this website, or if you need
          information in an alternative format, please let us know:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Email:{" "}
            <a
              href={`mailto:${CLINIC.email}`}
              className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
            >
              {CLINIC.email}
            </a>
          </li>
          <li>Phone: {CLINIC.phoneDisplay}</li>
          <li>
            <Link
              href="/contact"
              className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
            >
              Contact form
            </Link>
          </li>
        </ul>
        <p>
          Please include the page URL and a description of the problem. We will
          try to respond within five working days and work to resolve issues as
          quickly as we can.
        </p>
      </LegalSection>

      <LegalSection title="Enforcement procedure">
        <p>
          If you are not satisfied with our response, you may refer the matter to
          the Equality Advisory and Support Service (EASS) or seek other
          remedies available under the Equality Act 2010.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
