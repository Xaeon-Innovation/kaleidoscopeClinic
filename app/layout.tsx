import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicChrome } from "@/components/PublicChrome";
import { PublicFooter } from "@/components/PublicFooter";
import { montserrat } from "@/lib/fonts";
import { getMetadataBase } from "@/lib/seo/metadata";
import { buildSiteJsonLdGraph } from "@/lib/seo/jsonld";
import { DEFAULT_DESCRIPTION, SITE_LOCALE, SITE_NAME, getSiteBaseUrl } from "@/lib/seo/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Kaleidoscope Dental Specialists | London",
    template: "%s | Kaleidoscope Dental Specialists",
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: getMetadataBase(),
  openGraph: {
    title: "Kaleidoscope Dental Specialists | London",
    description: DEFAULT_DESCRIPTION,
    url: getSiteBaseUrl(),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--surface)] font-sans text-[var(--foreground)]">
        <JsonLd id="jsonld-site" data={buildSiteJsonLdGraph()} />
        {children}
        <PublicFooter />
        <PublicChrome />
      </body>
    </html>
  );
}
