import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { PublicChrome } from "@/components/PublicChrome";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

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
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--surface)] text-[var(--foreground)]">
        {children}
        <PublicChrome />
      </body>
    </html>
  );
}
