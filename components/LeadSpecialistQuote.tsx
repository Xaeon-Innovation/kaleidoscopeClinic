export function LeadSpecialistQuote() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-6 sm:px-6 sm:py-7">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
        From our lead specialist
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="hidden w-px self-stretch bg-[var(--gold)]/70 lg:block" aria-hidden />
        <div className="relative lg:pl-2">
          <span
            className="absolute -left-1 -top-2 select-none font-[var(--font-serif)] text-[2rem] leading-none text-[var(--gold)] opacity-85 sm:-left-2 sm:text-[2.25rem]"
            aria-hidden
          >
            &ldquo;
          </span>
          <blockquote className="max-w-2xl pl-6 font-[var(--font-serif)] text-base italic leading-relaxed text-white sm:pl-8 sm:text-lg lg:text-[1.125rem] lg:leading-snug">
            Every smile we restore is a story of renewed confidence - and a
            reminder of why we do this work.
          </blockquote>
          <span
            className="ml-1 inline-block translate-y-0.5 select-none font-[var(--font-serif)] text-[2rem] leading-none text-[var(--gold)] opacity-85 sm:text-[2.25rem]"
            aria-hidden
          >
            &rdquo;
          </span>
          <div className="mt-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/25">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M5.5 19c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-white sm:text-sm">
                Dr Sherif Elsharkawy
              </div>
              <div className="text-[0.65rem] text-white/50 sm:text-xs">
                Lead Specialist &amp; Co-Founder, Kaleidoscope Dental
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}