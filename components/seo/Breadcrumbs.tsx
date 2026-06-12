import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  path: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLdItems = items.map((item) => ({
    name: item.label,
    path: item.path,
  }));

  return (
    <>
      <JsonLd id="jsonld-breadcrumbs" data={buildBreadcrumbJsonLd(jsonLdItems)} />
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--brand-dark)]/65">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span aria-hidden className="text-[var(--brand-dark)]/35">
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span aria-current="page" className="text-[var(--brand-dark)]/85">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[var(--brand-dark)]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
