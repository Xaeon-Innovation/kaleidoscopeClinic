import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PublicChrome } from "@/components/PublicChrome";
import { PublicFooter } from "@/components/PublicFooter";
import { montserrat } from "@/lib/fonts";

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
  description:
    "Specialist-led implant and restorative dentistry in London. Advanced digital planning, predictable outcomes, and concierge-style care.",
  metadataBase: new URL("https://kaleidoscopedental.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kaleidoscope Dental Specialists | London",
    description:
      "Specialist-led implant and restorative dentistry in London. Advanced digital planning, predictable outcomes, and concierge-style care.",
    url: "https://kaleidoscopedental.co.uk",
    siteName: "Kaleidoscope Dental Specialists",
    locale: "en_GB",
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
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--surface)] font-sans text-[var(--foreground)]">
        {children}
        <PublicFooter />
        <PublicChrome />
      </body>
    </html>
  );
}
