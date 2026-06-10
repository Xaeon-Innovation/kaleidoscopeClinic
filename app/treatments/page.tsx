import { CTASection } from "@/components/about/CTASection";
import { SiteHeader } from "@/components/SiteHeader";
import { TreatmentsSection } from "@/components/treatments/TreatmentsSection";
import { getTreatmentsContent } from "@/lib/content/getContent";

export const metadata = {
  title: "Treatments",
  description:
    "Explore specialist dental treatments including full arch implants, smile makeovers, full mouth rehabilitation, and preventive care at Kaleidoscope Dental Specialists.",
};

export default async function TreatmentsPage() {
  const { treatments, flagshipSlug, treatmentImages } =
    await getTreatmentsContent();

  return (
    <div className="min-h-full">
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
