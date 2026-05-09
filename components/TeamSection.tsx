import { CtaButton } from "@/components/CtaButton";

export function TeamSection({ className = "" }: { className?: string }) {
  return (
    <div
      role="region"
      aria-labelledby="specialists-heading"
      className={`rounded-[var(--radius-card)] bg-[var(--surface-warm)] px-4 py-12 sm:px-8 sm:py-14 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-[0.22em] text-[var(--gold)]">
          THE SPECIALISTS
        </p>
        <h2
          id="specialists-heading"
          className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl"
        >
          Two specialists, one seamless experience.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--brand-dark)]/85 sm:text-base">
          Dr Elsharkawy and Dr Rashed treat every patient as a shared case —
          combining structural precision with aesthetic intelligence. You
          don&apos;t choose one; you benefit from both.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-8">
        <article className="flex flex-col rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--brand-dark)]/10">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--brand-dark)]/5">
            <div className="flex h-full w-full items-center justify-center text-xs text-[var(--brand-dark)]/40">
              Photo
            </div>
          </div>
          <div className="mt-5">
            <span className="inline-block rounded-md bg-[var(--gold)] px-3 py-1 text-[10px] font-semibold tracking-wide text-[var(--ink-on-gold)]">
              HONORARY CONSULTANT
            </span>
          </div>
          <h3 className="mt-4 font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
            Dr Sherif Elsharkawy
          </h3>
          <p className="mt-2 text-[11px] font-semibold leading-snug tracking-wide text-[var(--gold)]">
            HONORARY CONSULTANT IN PROSTHODONTICS
          </p>
          <p className="mt-3 text-sm text-[var(--brand-dark)]/85">
            Honorary Consultant &amp; Senior Clinical Lecturer — King&apos;s
            College London Dental Institute
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[
              "Dental Implants",
              "Full Arch Restoration",
              "Crowns & Bridges",
              "Implant Rehabilitation",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--brand-dark)]/25 bg-white px-2 py-2 text-center text-xs font-medium text-[var(--brand-dark)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>

        <article className="flex flex-col rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-soft)] ring-1 ring-[var(--brand-dark)]/10">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--brand-dark)]/5">
            <div className="flex h-full w-full items-center justify-center text-xs text-[var(--brand-dark)]/40">
              Photo
            </div>
          </div>
          <div className="mt-5">
            <span className="inline-block rounded-md bg-[var(--gold)] px-3 py-1 text-[10px] font-semibold tracking-wide text-[var(--ink-on-gold)]">
              MRCSED
            </span>
          </div>
          <h3 className="mt-4 font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
            Dr Sumaia Rashed
          </h3>
          <p className="mt-2 text-[11px] font-semibold leading-snug tracking-wide text-[var(--gold)]">
            DENTIST WITH SPECIAL INTEREST IN PROSTHODONTICS &amp; IMPLANTS
          </p>
          <p className="mt-3 text-sm text-[var(--brand-dark)]/85">
            MRCSEd — Member of the Royal College of Surgeons of Edinburgh
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[
              "Smile Makeovers",
              "Veneers & Bonding",
              "Facial Aesthetics",
              "Full Mouth Rehabilitation",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--brand-dark)]/25 bg-white px-2 py-2 text-center text-xs font-medium text-[var(--brand-dark)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-10 flex justify-center">
        <CtaButton href="/contact#book" variant="primary">
          Book consultation
        </CtaButton>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--brand-dark)]/65">
        Visiting specialists (implant, perio, endo, ortho) available by
        arrangement.
      </p>
    </div>
  );
}
