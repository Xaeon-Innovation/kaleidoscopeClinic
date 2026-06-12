import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { CLINIC } from "@/components/siteLinks";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Cookie Policy",
  description:
    "How Kaleidoscope Dental Specialists uses cookies and similar technologies on this website.",
  path: "/cookies",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="This policy explains what cookies are, how we use them on our website, and the choices available to you."
    >
      <LegalSection title="What are cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help sites remember preferences, keep sessions secure,
          and understand how pages are used.
        </p>
      </LegalSection>

      <LegalSection title="How we use cookies">
        <p>We use cookies and similar technologies for the following purposes:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Strictly necessary:</strong> required for core site
            functions such as secure admin access and booking flows
          </li>
          <li>
            <strong>Functional:</strong> to remember choices that improve your
            experience where applicable
          </li>
          <li>
            <strong>Performance:</strong> to understand how visitors use the site
            so we can improve it, where analytics tools are enabled
          </li>
        </ul>
        <p>
          We do not use cookies to sell your personal information to third
          parties.
        </p>
      </LegalSection>

      <LegalSection title="Cookies you may encounter">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--brand-dark)]/15">
                <th className="py-2 pr-4 font-semibold text-[var(--brand-dark)]">
                  Name / type
                </th>
                <th className="py-2 pr-4 font-semibold text-[var(--brand-dark)]">
                  Purpose
                </th>
                <th className="py-2 font-semibold text-[var(--brand-dark)]">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="text-[var(--brand-dark)]/75">
              <tr className="border-b border-[var(--brand-dark)]/8">
                <td className="py-3 pr-4 align-top">Session cookies</td>
                <td className="py-3 pr-4 align-top">
                  Maintain secure sessions (for example admin login)
                </td>
                <td className="py-3 align-top">Session / short-lived</td>
              </tr>
              <tr className="border-b border-[var(--brand-dark)]/8">
                <td className="py-3 pr-4 align-top">Booking &amp; payment</td>
                <td className="py-3 pr-4 align-top">
                  Support online consultation booking and deposit payment via
                  our payment provider
                </td>
                <td className="py-3 align-top">As set by provider</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 align-top">Third-party embeds</td>
                <td className="py-3 pr-4 align-top">
                  Maps or media embedded on pages may set their own cookies
                </td>
                <td className="py-3 align-top">Varies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="Managing cookies">
        <p>
          You can control cookies through your browser settings, including
          blocking or deleting cookies. Blocking strictly necessary cookies may
          affect how parts of the website work (for example online booking).
        </p>
        <p>
          For more information, visit{" "}
          <a
            href="https://www.aboutcookies.org"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
          >
            aboutcookies.org
          </a>{" "}
          or your browser&apos;s help pages.
        </p>
      </LegalSection>

      <LegalSection title="Updates">
        <p>
          We may update this Cookie Policy when our website or providers change.
          Please check this page periodically for the latest information.
        </p>
      </LegalSection>

      <LegalSection title="More information">
        <p>
          For how we handle personal data, see our{" "}
          <Link
            href="/privacy"
            className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
          >
            Privacy Policy
          </Link>
          . Questions? Contact us at{" "}
          <a
            href={`mailto:${CLINIC.email}`}
            className="font-medium text-[var(--brand-dark)] underline decoration-[var(--gold)]/60 underline-offset-2"
          >
            {CLINIC.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
