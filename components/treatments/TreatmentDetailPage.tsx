import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/about/CTASection";
import { SectionLabel } from "@/components/about/shared";
import { CtaButton } from "@/components/CtaButton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { TreatmentFaqSection } from "@/components/treatments/TreatmentFaqSection";
import type { TreatmentSeoContent } from "@/lib/treatments/content/types";
import type { TreatmentDisplay } from "@/lib/treatments/mapService";
import {
  buildFaqPageJsonLd,
  buildMedicalProcedureJsonLd,
} from "@/lib/seo/jsonld";
import { treatmentImageAlt } from "@/lib/treatments/imageAlt";

function ProseBody({ body }: { body: string }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-[var(--brand-dark)]/78 sm:text-base">
      {body.split("\n\n").map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  );
}

type TreatmentDetailPageProps = {
  seo: TreatmentSeoContent;
  treatment: TreatmentDisplay;
  imageSrc?: string;
  relatedTreatments: TreatmentDisplay[];
  relatedImages: Record<string, string>;
};

export function TreatmentDetailPage({
  seo,
  treatment,
  imageSrc,
  relatedTreatments,
  relatedImages,
}: TreatmentDetailPageProps) {
  const path = `/treatments/${seo.slug}`;
  const bookHref = `/book?consultation=${encodeURIComponent(seo.slug)}`;

  const breadcrumbItems = [
    { label: "Home", href: "/", path: "/" },
    { label: "Treatments", href: "/treatments", path: "/treatments" },
    { label: treatment.name, path },
  ];

  return (
    <div className="min-h-full">
      <JsonLd
        id={`jsonld-procedure-${seo.slug}`}
        data={buildMedicalProcedureJsonLd({
          name: treatment.name,
          description: seo.intro,
          path,
        })}
      />
      <JsonLd id={`jsonld-faq-${seo.slug}`} data={buildFaqPageJsonLd(seo.faqs)} />

      <SiteHeader />

      <section className="page-section page-section-hero relative overflow-hidden bg-linear-to-b from-[var(--section-cream)] via-[var(--section-cream-mid)] to-white">
        <div className="page-section-inner relative py-14 sm:py-16 lg:py-20">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="max-w-xl space-y-5">
              <SectionLabel>Specialist treatment · London W1</SectionLabel>
              <h1 className="font-[var(--font-serif)] text-4xl leading-[1.06] tracking-tight sm:text-5xl">
                {seo.h1}
              </h1>
              <p className="text-base leading-relaxed text-[var(--brand-dark)]/78 sm:text-lg">
                {seo.intro}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <CtaButton href={bookHref} variant="primary" className="h-11">
                  Book Consultation
                </CtaButton>
                <CtaButton href="/contact" variant="secondary" className="h-11">
                  Ask a question
                </CtaButton>
              </div>
            </div>

            {imageSrc && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-[var(--brand-dark)]/15">
                <Image
                  src={imageSrc}
                  alt={treatmentImageAlt(treatment.name)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {seo.sections.map((section) => (
        <section
          key={section.heading}
          className="page-section border-t border-[var(--brand-dark)]/6 bg-white"
        >
          <div className="page-section-inner max-w-3xl">
            <h2 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
              {section.heading}
            </h2>
            <div className="mt-5">
              <ProseBody body={section.body} />
            </div>
          </div>
        </section>
      ))}

      <TreatmentFaqSection faqs={seo.faqs} />

      {relatedTreatments.length > 0 && (
        <section className="page-section bg-white">
          <div className="page-section-inner">
            <h2 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
              Related treatments
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTreatments.map((related) => {
                const relatedImage = relatedImages[related.slug];
                return (
                  <Link
                    key={related.slug}
                    href={`/treatments/${related.slug}`}
                    className="group overflow-hidden rounded-2xl border border-[var(--brand-dark)]/10 bg-[var(--surface-warm)] transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {relatedImage && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={relatedImage}
                          alt={treatmentImageAlt(related.name)}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-[var(--font-serif)] text-lg font-semibold text-[var(--brand-dark)]">
                        {related.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--brand-dark)]/70">
                        {related.subtitle}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="page-section bg-[var(--section-cream)]">
        <div className="page-section-inner max-w-3xl text-center">
          <h2 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
            Book your consultation
          </h2>
          <p className="mx-auto mt-4 max-w-prose text-sm leading-relaxed text-[var(--brand-dark)]/75 sm:text-base">
            Ready to discuss {treatment.name.toLowerCase()}? Book a consultation
            at our Marylebone clinic in London W1 — specialist-led care with
            clear planning from the first visit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CtaButton href={bookHref} variant="primary" className="h-11">
              Book Consultation
            </CtaButton>
            <CtaButton href="/contact" variant="secondary" className="h-11">
              Contact us
            </CtaButton>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
