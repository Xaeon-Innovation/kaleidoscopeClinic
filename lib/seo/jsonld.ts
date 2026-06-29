import {
  CLINIC_ADDRESS,
  CLINIC_CONTACT,
  SITE_NAME,
  absoluteUrl,
  getSiteBaseUrl,
} from "./site";

type BreadcrumbItem = { name: string; path: string };
type FaqItem = { question: string; answer: string };

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteBaseUrl(),
    logo: absoluteUrl("/images/logo-gold.png"),
    image: absoluteUrl("/images/logo-gold.png"),
    email: CLINIC_CONTACT.email,
    telephone: CLINIC_CONTACT.telephone,
    address: {
      "@type": "PostalAddress",
      ...CLINIC_ADDRESS,
    },
  };
}

export function buildDentistJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: SITE_NAME,
    url: getSiteBaseUrl(),
    logo: absoluteUrl("/images/logo-gold.png"),
    image: absoluteUrl("/images/logo-gold.png"),
    telephone: CLINIC_CONTACT.telephone,
    email: CLINIC_CONTACT.email,
    address: {
      "@type": "PostalAddress",
      ...CLINIC_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.5154,
      longitude: -0.1589,
    },
    areaServed: {
      "@type": "City",
      name: "London",
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteBaseUrl(),
    inLanguage: "en-GB",
  };
}

export function buildSiteJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(),
      buildDentistJsonLd(),
      buildWebSiteJsonLd(),
    ],
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildMedicalProcedureJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      "@type": "Dentist",
      name: SITE_NAME,
      url: getSiteBaseUrl(),
      address: {
        "@type": "PostalAddress",
        ...CLINIC_ADDRESS,
      },
    },
  };
}

export function buildFaqPageJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildItemListJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
