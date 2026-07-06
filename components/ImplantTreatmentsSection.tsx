import Image from "next/image";
import Link from "next/link";
import type { TreatmentDisplay } from "@/lib/treatments/mapService";
import { treatmentImageAlt } from "@/lib/treatments/imageAlt";
import {
  type TreatmentCategory,
} from "@/lib/treatments";

const categoryLabel: Record<Exclude<TreatmentCategory, "all">, string> = {
  implants: "Implants",
  restorative: "Restorative",
  aesthetic: "Aesthetic",
  preventive: "Preventive",
};

export function ImplantTreatmentsSection({
  treatments,
  flagshipSlug,
  treatmentImages,
}: {
  treatments: TreatmentDisplay[];
  flagshipSlug: string;
  treatmentImages: Record<string, string>;
}) {
  if (treatments.length === 0) return null;

  const flagship =
    treatments.find((t) => t.slug === flagshipSlug) ?? treatments[0]!;
  const others = treatments.filter((t) => t.slug !== flagship.slug);
  const flagshipImage =
    treatmentImages[flagship.slug] ?? flagship.imageSrc ?? "/images/fullArch.jpeg";
  const flagshipDetailHref = `/treatments/${flagship.slug}`;

  return (
    <section
      aria-labelledby="treatments-heading"
      className="page-section bg-linear-to-br from-[var(--section-cream)] via-[var(--section-cream-warm)] to-[var(--section-cream-sage-deep)]"
    >
      <div className="page-section-inner">
        <header className="mb-10 space-y-3 md:mb-12 md:space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--charcoal-2)]">
            Our treatments
          </p>
          <h2
            id="treatments-heading"
            className="max-w-xl font-[var(--font-serif)] text-3xl font-semibold tracking-tight text-[var(--brand-dark)] md:text-4xl"
          >
            Built to show implants as the clinic&apos;s center of excellence
          </h2>
          <p className="max-w-2xl text-sm text-[var(--brand-dark)]/75 md:text-base">
            Implants are the flagship service, so this section gives{" "}
            {flagship.name} the most space, proof, and emphasis, while other
            treatments sit clearly beneath as supporting options.
          </p>
        </header>

        <div className="space-y-8 md:space-y-10">
          <article className="group relative min-h-[22rem] overflow-hidden rounded-3xl shadow-2xl shadow-[var(--brand-dark)]/20 transition-transform duration-200 hover:-translate-y-0.5 md:min-h-[19rem]">
            <Link
              href={flagshipDetailHref}
              className="absolute inset-0 z-[1] rounded-3xl"
              aria-label={`View ${flagship.name}`}
            />
            <Image
              src={flagshipImage}
              alt={treatmentImageAlt(flagship.name)}
              fill
              className="pointer-events-none object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={false}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#022c22]/88 via-[#022c22]/55 to-[#022c22]/10 md:via-[#022c22]/40 md:to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#022c22]/50 via-transparent to-transparent md:hidden"
              aria-hidden
            />

            <div className="relative z-10 grid pointer-events-none md:grid-cols-[1.15fr_0.85fr] md:items-stretch">
              <div className="relative space-y-4 p-6 text-white md:p-8 lg:p-10 lg:space-y-5">
                <p
                  className="pointer-events-none absolute left-6 top-6 max-w-[min(100%,28rem)] font-[var(--font-serif)] text-[clamp(1.75rem,5vw,3.25rem)] font-medium uppercase leading-[0.95] tracking-tight text-white/[0.07] md:left-8 md:top-8 lg:left-10 lg:top-10"
                  aria-hidden
                >
                  {flagship.name}
                  <span className="block text-[0.55em] normal-case tracking-normal opacity-80">
                    {categoryLabel[flagship.category]}
                  </span>
                </p>

                <span className="relative inline-flex rounded-full border border-[var(--gold)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Flagship treatment
                </span>

                <div className="relative space-y-2">
                  <h3 className="font-[var(--font-serif)] text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl lg:text-[2.05rem]">
                    {flagship.name}
                  </h3>
                  <p className="max-w-prose text-sm leading-relaxed text-white/80 md:text-[0.95rem]">
                    {flagship.subtitle}
                  </p>
                </div>

                {flagship.bullets.length > 0 && (
                  <ul className="relative grid gap-2 text-sm text-white/85 md:grid-cols-2 md:gap-x-4 md:gap-y-2">
                    {flagship.bullets.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                )}

                <div className="relative flex flex-wrap items-center gap-4 pt-1 pointer-events-auto">
                  <Link
                    href={`/book?consultation=${encodeURIComponent(flagship.slug)}`}
                    className="inline-flex rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm ring-1 ring-white/15 transition hover:bg-black/55"
                  >
                    Book consultation
                  </Link>
                </div>
              </div>

              <aside className="relative flex items-end justify-start p-6 pb-8 md:items-center md:justify-end md:p-8 lg:p-10">
                <div className="text-left md:text-right" aria-hidden>
                  <p className="font-[var(--font-serif)] leading-none text-white drop-shadow-[0_2px_12px_rgba(2,44,34,0.85)]">
                    <span className="text-[clamp(3.5rem,12vw,6.5rem)] font-medium tracking-tight text-[var(--gold)]">
                      {others.length + 1}
                    </span>
                    <span className="ml-1 text-[clamp(1.35rem,4vw,2.35rem)] font-normal lowercase tracking-tight">
                      treatments
                    </span>
                  </p>
                  <p className="mt-1 max-w-[14rem] text-xs font-medium uppercase tracking-[0.14em] text-white/90 drop-shadow-[0_1px_8px_rgba(2,44,34,0.8)] md:ml-auto">
                    Specialist-led care
                  </p>
                </div>
              </aside>
            </div>
          </article>

          {others.length > 0 && (
            <>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--charcoal-2)]">
                  Other treatments
                </p>
                <h4 className="font-[var(--font-serif)] text-xl font-semibold text-[var(--brand-dark)] md:text-2xl">
                  Supporting services, clearly separated
                </h4>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {others.map((treatment) => {
                  const resolvedImage =
                    treatmentImages[treatment.slug] ?? treatment.imageSrc;
                  return (
                    <Link
                      key={treatment.slug}
                      href={`/treatments/${treatment.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--brand-dark)]/10 bg-white p-3.5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--gold)]/50 hover:shadow-md sm:p-4"
                    >
                      <div className="relative mb-3 aspect-[3/2] w-full overflow-hidden rounded-xl bg-[var(--surface-warm)]">
                        {resolvedImage ? (
                          <Image
                            src={resolvedImage}
                            alt={treatmentImageAlt(treatment.name)}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                          />
                        ) : (
                          <div className="flex h-full items-end p-3">
                            <span className="inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]/55 ring-1 ring-[var(--brand-dark)]/10">
                              {categoryLabel[treatment.category]}
                            </span>
                          </div>
                        )}
                      </div>

                      <strong className="block text-sm font-semibold tracking-tight text-[var(--brand-dark)] sm:text-base">
                        {treatment.name}
                      </strong>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--brand-dark)]/70 sm:text-sm">
                        {treatment.subtitle}
                      </p>

                      <span className="mt-3 inline-flex w-fit items-center rounded-full bg-[var(--surface-warm)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--brand-dark)]/55">
                        {categoryLabel[treatment.category]}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
