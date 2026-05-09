import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Manage site content and keep the homepage conversion-first and
          scannable.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { href: "/admin/services", title: "Services", copy: "Edit treatment cards and page content." },
          { href: "/admin/team", title: "Team", copy: "Add and update clinician profiles." },
          { href: "/admin/testimonials", title: "Testimonials", copy: "Publish trust-building reviews." },
          { href: "/admin/before-after", title: "Before & After", copy: "Upload and order clinical cases." },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/10 transition hover:ring-black/20"
          >
            <div className="text-base font-semibold tracking-tight">
              {c.title}
            </div>
            <p className="mt-2 text-sm text-black/65">{c.copy}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

