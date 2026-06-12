import { CTASection } from "@/components/about/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { TreatmentsSection } from "@/components/treatments/TreatmentsSection";
import { getTreatmentsContent } from "@/lib/content/getContent";
import { buildItemListJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata = buildPageMetadata({
  title: "Dental Treatments London",
  description:
    "Specialist dental treatments in Marylebone, London — full arch implants, dental implants, smile makeovers, full mouth rehabilitation, and preventive care.",
  path: "/treatments",
});

export default async function TreatmentsPage() {
  const { treatments, flagshipSlug, treatmentImages } =
    await getTreatmentsContent();

  const itemListJsonLd = buildItemListJsonLd(
    treatments.map((t) => ({
      name: t.name,
      path: `/treatments/${t.slug}`,
    }))
  );

  return (
    <div className="min-h-full">
      <JsonLd id="jsonld-treatments-list" data={itemListJsonLd} />
      <SiteHeader />
      <TreatmentsSection
        treatments={treatments}
        flagshipSlug={flagshipSlug}
        treatmentImages={treatmentImages}
      />
      <CTASection />
    </div>
  );
}
