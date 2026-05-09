import { CLINIC, getWhatsAppHref } from "./siteLinks";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="font-semibold tracking-tight text-black">
            {CLINIC.name}
          </div>
          <p className="text-sm leading-relaxed text-black/65">
            Specialist-led implant and restorative dentistry, focused on
            predictable, long-lasting outcomes.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="font-semibold tracking-tight">Contact</div>
          <a
            className="block text-black/70 hover:text-black"
            href={CLINIC.phoneHref}
          >
            {CLINIC.phoneDisplay}
          </a>
          <a
            className="block text-black/70 hover:text-black"
            href={`mailto:${CLINIC.email}`}
          >
            {CLINIC.email}
          </a>
          <a
            className="block text-black/70 hover:text-black"
            href={getWhatsAppHref()}
            target="_blank"
            rel="noreferrer"
          >
            Message on WhatsApp
          </a>
        </div>

        <div className="space-y-2 text-sm">
          <div className="font-semibold tracking-tight">Location</div>
          <div className="text-black/70">
            <div>{CLINIC.addressLines[0]}</div>
            <div>{CLINIC.addressLines[1]}</div>
          </div>
          <div className="text-black/70">
            By appointment • Evening availability
          </div>
        </div>
      </div>
      <div className="px-4 pb-10 sm:pb-10">
        <div className="mx-auto max-w-6xl border-t border-black/10 pt-6 text-xs text-black/55">
          © {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

