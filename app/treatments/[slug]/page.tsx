import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentDetailPage } from "@/components/treatments/TreatmentDetailPage";
import { getTreatmentsContent } from "@/lib/content/getContent";
import {
  getAllTreatmentSeoSlugs,
  getTreatmentSeoContent,
} from "@/lib/treatments/getTreatmentSeoContent";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveTreatmentImage } from "@/lib/treatments/mapService";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllTreatmentSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = getTreatmentSeoContent(slug);
  if (!seo) return {};

  const imageSrc = resolveTreatmentImage(slug);

  return buildPageMetadata({
    title: seo.metaTitle,
    description: seo.metaDescription,
    path: `/treatments/${slug}`,
    ogImage: imageSrc,
  });
}

export default async function TreatmentSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const seo = getTreatmentSeoContent(slug);
  if (!seo) notFound();

  const { treatments, treatmentImages } = await getTreatmentsContent();
  const treatment = treatments.find((t) => t.slug === slug);
  if (!treatment) notFound();

  const relatedTreatments = seo.relatedSlugs
    .map((relatedSlug) => treatments.find((t) => t.slug === relatedSlug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <TreatmentDetailPage
      seo={seo}
      treatment={treatment}
      imageSrc={treatmentImages[slug] ?? treatment.imageSrc}
      relatedTreatments={relatedTreatments}
      relatedImages={treatmentImages}
    />
  );
}
