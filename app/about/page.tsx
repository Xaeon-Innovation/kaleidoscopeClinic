import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/about/HeroSection";
import { StorySection } from "@/components/about/StorySection";
import { PillarsSection } from "@/components/about/PillarsSection";
import { TeamSection } from "@/components/about/TeamSection";
import { CredentialsSection } from "@/components/about/CredentialsSection";
import { TechnologySection } from "@/components/about/TechnologySection";
import { PhilosophySection } from "@/components/about/PhilosophySection";
import { ProcessSection } from "@/components/about/ProcessSection";
import { TestimonialsSection } from "@/components/about/TestimonialsSection";
import { CTASection } from "@/components/about/CTASection";
import { getTeam } from "@/lib/content/getContent";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About Us",
  description:
    "Meet Sherif and Sumaia — GDC-registered Specialists in Prosthodontics at Kaleidoscope Dental Specialists, Marylebone, London. Learn about our approach, technology, and values.",
  path: "/about",
});

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <div className="min-h-full">
      <SiteHeader />
      <HeroSection />
      <StorySection />
      <PillarsSection />
      <TeamSection members={team} />
      <CredentialsSection />
      <TechnologySection />
      <PhilosophySection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
